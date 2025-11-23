# Deploy New Application with Subdomain on Azure AKS + Istio

## Context
We have an Azure AKS cluster with Istio service mesh deployed. The base domain `cat-herding.net` is managed in Azure DNS. We need to deploy a new application accessible via a subdomain (e.g., `api.cat-herding.net`) with HTTP/HTTPS routing through Istio Gateway.

## Prerequisites
- Azure CLI (`az`) authenticated and configured
- `kubectl` configured for AKS cluster
- Istio installed on AKS cluster with external ingress gateway selector: `istio: aks-istio-ingressgateway-external`
- Azure DNS Zone for `cat-herding.net` exists
- TLS certificate available or cert-manager configured

## Required Information
- **App Name**: `<APP_NAME>` (e.g., `api-service`, `blog`, `admin`)
- **Subdomain**: `<SUBDOMAIN>.cat-herding.net` (e.g., `api.cat-herding.net`)
- **Container Image**: `<ACR_NAME>.azurecr.io/<IMAGE>:<TAG>`
- **Service Port**: Port the app listens on (e.g., `8080`, `3000`)
- **Namespace**: Kubernetes namespace (default: `default`)
- **Resource Group**: Azure resource group name
- **DNS Zone Name**: `cat-herding.net`

## Deployment Checklist

### 1. Azure DNS Configuration
**Goal**: Create A record pointing subdomain to Istio Ingress Gateway Load Balancer IP

```bash
# Get Istio Ingress Gateway external IP
kubectl get svc -n aks-istio-ingress aks-istio-ingressgateway-external -o jsonpath='{.status.loadBalancer.ingress[0].ip}'

# Set variables
INGRESS_IP="<LOAD_BALANCER_IP>"
RESOURCE_GROUP="<RESOURCE_GROUP>"
DNS_ZONE="cat-herding.net"
SUBDOMAIN="<SUBDOMAIN>"  # Just the subdomain part (e.g., "api")

# Create DNS A record
az network dns record-set a add-record \
  --resource-group "$RESOURCE_GROUP" \
  --zone-name "$DNS_ZONE" \
  --record-set-name "$SUBDOMAIN" \
  --ipv4-address "$INGRESS_IP"

# Verify DNS record
az network dns record-set a show \
  --resource-group "$RESOURCE_GROUP" \
  --zone-name "$DNS_ZONE" \
  --name "$SUBDOMAIN"

# Test DNS resolution (may take 1-5 minutes)
nslookup "${SUBDOMAIN}.${DNS_ZONE}"
```

**Checklist**:
- [ ] Retrieved Istio ingress IP
- [ ] Created DNS A record in Azure DNS
- [ ] Verified DNS record exists
- [ ] Confirmed DNS resolution works

---

### 2. TLS Certificate Setup
**Goal**: Ensure TLS certificate secret exists for HTTPS

**Option A: Using existing certificate (manual)**
```bash
# Create TLS secret from certificate files
kubectl create secret tls <SUBDOMAIN>-tls \
  --cert=path/to/tls.crt \
  --key=path/to/tls.key \
  --namespace=default

# Verify secret
kubectl get secret <SUBDOMAIN>-tls -n default
```

**Option B: Using cert-manager (automated)**
```yaml
# Create Certificate resource (save as certificate.yaml)
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: <SUBDOMAIN>-tls-cert
  namespace: default
spec:
  secretName: <SUBDOMAIN>-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
    - "<SUBDOMAIN>.cat-herding.net"
```

```bash
# Apply certificate
kubectl apply -f certificate.yaml

# Check certificate status
kubectl get certificate <SUBDOMAIN>-tls-cert -n default
kubectl describe certificate <SUBDOMAIN>-tls-cert -n default
```

**Checklist**:
- [ ] TLS secret created/exists
- [ ] Secret is in correct namespace (same as Gateway)
- [ ] Certificate is valid

---

### 3. Create Kubernetes Manifests
**Goal**: Create deployment, service, and Istio routing manifests

**Directory Structure**:
```
k8s/apps/<APP_NAME>/
├── base/
│   ├── kustomization.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── istio-gateway.yaml
│   └── istio-virtualservice.yaml
```

**3a. Deployment** (`deployment.yaml`):
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: <APP_NAME>
spec:
  replicas: 2
  selector:
    matchLabels:
      app: <APP_NAME>
  template:
    metadata:
      labels:
        app: <APP_NAME>
        version: v1
      annotations:
        sidecar.istio.io/inject: 'false'  # Disable if not using ambient mesh
    spec:
      containers:
        - name: <APP_NAME>
          image: <ACR_NAME>.azurecr.io/<IMAGE>:<TAG>
          imagePullPolicy: Always
          ports:
            - containerPort: <SERVICE_PORT>
              name: http
          env:
            - name: PORT
              value: "<SERVICE_PORT>"
          resources:
            requests:
              cpu: 250m
              memory: 512Mi
            limits:
              cpu: 1000m
              memory: 1Gi
          livenessProbe:
            httpGet:
              path: /health
              port: http
            initialDelaySeconds: 30
            periodSeconds: 15
          readinessProbe:
            httpGet:
              path: /health
              port: http
            initialDelaySeconds: 5
            periodSeconds: 10
```

**3b. Service** (`service.yaml`):
```yaml
apiVersion: v1
kind: Service
metadata:
  name: <APP_NAME>
spec:
  selector:
    app: <APP_NAME>
  ports:
    - name: http
      port: 80
      targetPort: <SERVICE_PORT>
  type: ClusterIP
```

**3c. Istio Gateway** (`istio-gateway.yaml`):
```yaml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: <APP_NAME>-gateway
  namespace: default
spec:
  selector:
    istio: aks-istio-ingressgateway-external
  servers:
    - port:
        number: 80
        name: http
        protocol: HTTP
      hosts:
        - "<SUBDOMAIN>.cat-herding.net"
    - port:
        number: 443
        name: https
        protocol: HTTPS
      hosts:
        - "<SUBDOMAIN>.cat-herding.net"
      tls:
        mode: SIMPLE
        credentialName: <SUBDOMAIN>-tls
```

**3d. Istio VirtualService** (`istio-virtualservice.yaml`):
```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: <APP_NAME>-virtualservice
spec:
  hosts:
    - "<SUBDOMAIN>.cat-herding.net"
  gateways:
    - <APP_NAME>-gateway
  http:
    - match:
        - uri:
            prefix: /
      route:
        - destination:
            host: <APP_NAME>
            port:
              number: 80
```

**3e. Kustomization** (`kustomization.yaml`):
```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - deployment.yaml
  - service.yaml
  - istio-gateway.yaml
  - istio-virtualservice.yaml

namespace: default
```

**Checklist**:
- [ ] Created deployment.yaml
- [ ] Created service.yaml
- [ ] Created istio-gateway.yaml with correct subdomain
- [ ] Created istio-virtualservice.yaml
- [ ] Created kustomization.yaml
- [ ] Updated all placeholders with actual values

---

### 4. Validate Manifests
**Goal**: Ensure manifests are valid before applying

```bash
# Validate kustomize build
kubectl kustomize k8s/apps/<APP_NAME>/base

# Dry-run apply
kubectl apply --dry-run=client -k k8s/apps/<APP_NAME>/base

# Check for any validation errors
kubectl apply --dry-run=server -k k8s/apps/<APP_NAME>/base
```

**Checklist**:
- [ ] Kustomize builds without errors
- [ ] Dry-run succeeds
- [ ] No validation warnings

---

### 5. Deploy Application
**Goal**: Apply manifests to cluster

```bash
# Apply manifests
kubectl apply -k k8s/apps/<APP_NAME>/base

# Watch deployment rollout
kubectl rollout status deployment/<APP_NAME> -n default

# Check pod status
kubectl get pods -l app=<APP_NAME> -n default

# Check pod logs
kubectl logs -l app=<APP_NAME> -n default --tail=50
```

**Checklist**:
- [ ] Deployment created successfully
- [ ] Pods are running
- [ ] Service exists
- [ ] Gateway created
- [ ] VirtualService created

---

### 6. Verify Istio Configuration
**Goal**: Ensure Istio routing is correctly configured

```bash
# Check Gateway
kubectl get gateway <APP_NAME>-gateway -n default -o yaml

# Check VirtualService
kubectl get virtualservice <APP_NAME>-virtualservice -n default -o yaml

# Check Istio ingress gateway logs
kubectl logs -n aks-istio-ingress -l istio=aks-istio-ingressgateway-external --tail=50

# Verify Istio configuration (if istioctl available)
istioctl analyze -n default
```

**Checklist**:
- [ ] Gateway shows correct hosts and TLS config
- [ ] VirtualService routes to correct service
- [ ] No Istio configuration errors
- [ ] Ingress gateway logs show no errors

---

### 7. Test Connectivity
**Goal**: Verify application is accessible via subdomain

```bash
# Test HTTP (should redirect to HTTPS or respond)
curl -v http://<SUBDOMAIN>.cat-herding.net

# Test HTTPS
curl -v https://<SUBDOMAIN>.cat-herding.net

# Test specific endpoint
curl https://<SUBDOMAIN>.cat-herding.net/health

# Test from inside cluster
kubectl run curl-test --image=curlimages/curl:latest --rm -it --restart=Never -- \
  curl -v http://<APP_NAME>.default.svc.cluster.local
```

**Checklist**:
- [ ] HTTP request succeeds
- [ ] HTTPS request succeeds with valid certificate
- [ ] Application responds correctly
- [ ] Internal service connectivity works

---

### 8. Add to Root Kustomization (Optional)
**Goal**: Include new app in centralized kustomization

```bash
# Edit k8s/kustomization.yaml
cat >> k8s/kustomization.yaml <<EOF
  - apps/<APP_NAME>/base
EOF

# Verify
kubectl kustomize k8s
```

**Checklist**:
- [ ] Added to root kustomization
- [ ] Root kustomize builds successfully

---

## Troubleshooting Commands

```bash
# Check all resources
kubectl get all -l app=<APP_NAME> -n default

# Describe problematic resources
kubectl describe deployment/<APP_NAME> -n default
kubectl describe pod/<POD_NAME> -n default

# Check events
kubectl get events -n default --sort-by='.lastTimestamp'

# Check ingress gateway
kubectl get svc -n aks-istio-ingress
kubectl describe svc aks-istio-ingressgateway-external -n aks-istio-ingress

# Test DNS from pod
kubectl run -it --rm debug --image=busybox --restart=Never -- nslookup <SUBDOMAIN>.cat-herding.net

# Check certificate
kubectl get secret <SUBDOMAIN>-tls -n default -o yaml
openssl x509 -in <(kubectl get secret <SUBDOMAIN>-tls -n default -o jsonpath='{.data.tls\.crt}' | base64 -d) -text -noout
```

---

## Example: Deploy API Service on api.cat-herding.net

```bash
# Variables
export APP_NAME="api-service"
export SUBDOMAIN="api"
export IMAGE="gabby.azurecr.io/api-service:latest"
export SERVICE_PORT="8080"
export RESOURCE_GROUP="my-aks-rg"

# 1. Get ingress IP and create DNS record
INGRESS_IP=$(kubectl get svc -n aks-istio-ingress aks-istio-ingressgateway-external -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
az network dns record-set a add-record --resource-group "$RESOURCE_GROUP" --zone-name "cat-herding.net" --record-set-name "$SUBDOMAIN" --ipv4-address "$INGRESS_IP"

# 2. Create TLS secret (assuming cert-manager or manual cert)
# (See step 2 above)

# 3. Create manifests in k8s/apps/api-service/base/
# (See step 3 above)

# 4. Apply
kubectl apply -k k8s/apps/api-service/base

# 5. Test
curl https://api.cat-herding.net/health
```

---

## Summary Checklist
- [ ] DNS A record created in Azure DNS
- [ ] DNS resolves correctly
- [ ] TLS certificate secret exists
- [ ] Kubernetes manifests created
- [ ] Manifests validated
- [ ] Application deployed
- [ ] Pods running
- [ ] Istio Gateway configured
- [ ] Istio VirtualService configured
- [ ] HTTPS connectivity works
- [ ] Application responds correctly
