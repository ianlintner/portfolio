# Kubernetes Deployment

Guide to deploying the Portfolio application on Kubernetes using the included manifests.

## Overview

The Portfolio application includes comprehensive Kubernetes manifests for production deployment with:

- Application deployment with multiple replicas
- PostgreSQL database (or Cloud SQL)
- Load balancing and ingress
- ConfigMaps and Secrets management
- GitOps with Flux CD

## Kubernetes Manifests

The Kubernetes configuration follows a Kustomize-based structure:

```
k8s/
├── apps/portfolio/
│   ├── base/               # Base manifests
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   ├── configmap.yaml
│   │   └── ingress.yaml
│   └── overlays/          # Environment-specific configs
│       ├── dev/
│       ├── staging/
│       └── prod/
└── flux-system/           # GitOps configuration
```

## Base Manifests

### Application Deployment

```yaml
# k8s/apps/portfolio/base/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolio
  labels:
    app: portfolio
spec:
  replicas: 3
  selector:
    matchLabels:
      app: portfolio
  template:
    metadata:
      labels:
        app: portfolio
    spec:
      containers:
      - name: portfolio
        image: portfolio:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: portfolio-secrets
              key: database-url
        - name: NEXTAUTH_SECRET
          valueFrom:
            secretKeyRef:
              name: portfolio-secrets
              key: nextauth-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Service Configuration

```yaml
# k8s/apps/portfolio/base/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: portfolio-service
spec:
  selector:
    app: portfolio
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP
```

### Ingress Configuration

```yaml
# k8s/apps/portfolio/base/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: portfolio-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - portfolio.example.com
    secretName: portfolio-tls
  rules:
  - host: portfolio.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: portfolio-service
            port:
              number: 80
```

## Environment Overlays

### Production Configuration

```yaml
# k8s/apps/portfolio/overlays/prod/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
- ../../base

patchesStrategicMerge:
- deployment-patch.yaml
- ingress-patch.yaml

replicas:
- name: portfolio
  count: 5

images:
- name: portfolio
  newTag: v1.0.0
```

```yaml
# k8s/apps/portfolio/overlays/prod/deployment-patch.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolio
spec:
  template:
    spec:
      containers:
      - name: portfolio
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        env:
        - name: NODE_ENV
          value: "production"
```

## Database Configuration

### PostgreSQL StatefulSet

```yaml
# k8s/apps/portfolio/base/postgres.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_DB
          value: portfolio
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: postgres-secrets
              key: username
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secrets
              key: password
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
```

## Secrets Management

### Creating Secrets

```bash
# Create database secret
kubectl create secret generic portfolio-secrets \
  --from-literal=database-url="postgresql://user:pass@postgres:5432/portfolio" \
  --from-literal=nextauth-secret="your-secret-key"

# Create from file
kubectl create secret generic portfolio-secrets \
  --from-env-file=.env.production
```

### Sealed Secrets (for GitOps)

```yaml
# k8s/apps/portfolio/base/sealed-secret.yaml
apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
metadata:
  name: portfolio-secrets
spec:
  encryptedData:
    database-url: AgBy3i4OJSWK+PiTySYZZA9rO43cGDEQAx...
    nextauth-secret: AgBy3i4OJSWK+PiTySYZZA9rO43cGDEQAx...
  template:
    metadata:
      name: portfolio-secrets
    type: Opaque
```

## Deployment Commands

### Manual Deployment

```bash
# Apply base configuration
kubectl apply -k k8s/apps/portfolio/base

# Apply production overlay
kubectl apply -k k8s/apps/portfolio/overlays/prod

# Check deployment status
kubectl get deployments
kubectl get pods
kubectl get services
```

### Rolling Updates

```bash
# Update image
kubectl set image deployment/portfolio portfolio=portfolio:v1.1.0

# Check rollout status
kubectl rollout status deployment/portfolio

# Rollback if needed
kubectl rollout undo deployment/portfolio
```

## GitOps with Flux CD

### Flux Configuration

```yaml
# k8s/flux-system/portfolio-kustomization.yaml
apiVersion: kustomize.toolkit.fluxcd.io/v1beta2
kind: Kustomization
metadata:
  name: portfolio
  namespace: flux-system
spec:
  interval: 10m
  path: "./k8s/apps/portfolio/overlays/prod"
  prune: true
  sourceRef:
    kind: GitRepository
    name: portfolio-repo
  validation: client
```

### Image Automation

```yaml
# k8s/flux-system/image-automation.yaml
apiVersion: image.toolkit.fluxcd.io/v1beta1
kind: ImageUpdateAutomation
metadata:
  name: portfolio-image-update
spec:
  interval: 1m
  sourceRef:
    kind: GitRepository
    name: portfolio-repo
  git:
    checkout:
      ref:
        branch: main
    commit:
      author:
        email: fluxcdbot@example.com
        name: fluxcdbot
      messageTemplate: |
        Automated image update
        
        Automation name: {{ .AutomationObject }}
        
        Files:
        {{ range $filename, $_ := .Updated.Files -}}
        - {{ $filename }}
        {{ end -}}
        
        Objects:
        {{ range $resource, $_ := .Updated.Objects -}}
        - {{ $resource.Kind }} {{ $resource.Name }}
        {{ end -}}
    push:
      branch: main
  update:
    path: "./k8s/apps/portfolio/overlays/prod"
    strategy: Setters
```

## Monitoring and Observability

### Health Checks

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';

export async function GET() {
  try {
    // Check database connection
    await db.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
```

### Prometheus Metrics

```yaml
# k8s/apps/portfolio/base/servicemonitor.yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: portfolio-metrics
spec:
  selector:
    matchLabels:
      app: portfolio
  endpoints:
  - port: metrics
    path: /api/metrics
```

## Scaling and Performance

### Horizontal Pod Autoscaler

```yaml
# k8s/apps/portfolio/base/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: portfolio-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: portfolio
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

## Security

### Network Policies

```yaml
# k8s/apps/portfolio/base/networkpolicy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: portfolio-netpol
spec:
  podSelector:
    matchLabels:
      app: portfolio
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 3000
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: postgres
    ports:
    - protocol: TCP
      port: 5432
```

### Pod Security Policy

```yaml
# k8s/apps/portfolio/base/podsecuritypolicy.yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: portfolio-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'RunAsAny'
```

## Troubleshooting

### Common Issues

```bash
# Check pod logs
kubectl logs -f deployment/portfolio

# Describe pod for events
kubectl describe pod <pod-name>

# Check service endpoints
kubectl get endpoints

# Debug networking
kubectl exec -it <pod-name> -- nslookup postgres

# Check resource usage
kubectl top pods
kubectl top nodes
```

### Debugging Commands

```bash
# Port forward for local access
kubectl port-forward svc/portfolio-service 3000:80

# Execute commands in pod
kubectl exec -it <pod-name> -- /bin/sh

# View cluster events
kubectl get events --sort-by=.metadata.creationTimestamp
```

For more deployment options, see [Environment Variables](environment.md) and [Docker Deployment](docker.md).