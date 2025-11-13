# Google Cloud SQL Setup using Config Connector CRDs

This document explains how to set up Google Cloud SQL instances for the portfolio application using Google Config Connector CRDs in a GitOps workflow.

## Prerequisites

- Google Cloud Project with billing enabled
- Kubernetes cluster with Google Config Connector installed
- Config Connector service account with appropriate permissions
- Flux CD or similar GitOps tool

## Config Connector Setup

### 1. Install Config Connector

If not already installed, install Config Connector in your cluster:

```bash
# Install Config Connector
kubectl apply -f https://raw.githubusercontent.com/GoogleCloudPlatform/k8s-config-connector/master/install-bundles/install-bundle-workload-identity/0-cnrm-system.yaml

# Create ConfigConnector resource
cat <<EOF | kubectl apply -f -
apiVersion: core.cnrm.cloud.google.com/v1beta1
kind: ConfigConnector
metadata:
  name: configconnector.core.cnrm.cloud.google.com
spec:
  mode: cluster
  googleServiceAccount: cnrm-system@PROJECT_ID.iam.gserviceaccount.com
EOF
```

### 2. Set up Config Connector Service Account

```bash
# Create service account for Config Connector
gcloud iam service-accounts create cnrm-system \
    --project=PROJECT_ID

# Grant necessary roles
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:cnrm-system@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/editor"

# Enable Workload Identity
gcloud iam service-accounts add-iam-policy-binding \
    cnrm-system@PROJECT_ID.iam.gserviceaccount.com \
    --role roles/iam.workloadIdentityUser \
    --member "serviceAccount:PROJECT_ID.svc.id.goog[cnrm-system/cnrm-controller-manager]"

# Annotate the Kubernetes service account
kubectl annotate serviceaccount cnrm-controller-manager \
    --namespace cnrm-system \
    iam.gke.io/gcp-service-account=cnrm-system@PROJECT_ID.iam.gserviceaccount.com
```

## Declarative Cloud SQL Setup

The Cloud SQL resources are now defined declaratively using CRDs in the Kubernetes manifests:

### Base Resources (`k8s/apps/portfolio/base/`)

1. **`cloudsql-instance.yaml`** - SQLInstance, SQLDatabase, and SQLUser CRDs
2. **`cloudsql-serviceaccount.yaml`** - IAMServiceAccount and IAMPolicy CRDs

### Environment-Specific Configuration

Each overlay (dev/staging/prod) patches the base resources with environment-specific settings:

- **Development**: `db-f1-micro` with 10GB HDD storage (~$7-12/month)
- **Staging**: `db-f1-micro` with 20GB SSD storage (~$10-15/month)
- **Production**: `db-g1-small` with 50GB SSD storage and regional availability (~$25-35/month)

## GitOps Deployment Workflow

1. **Replace PROJECT_ID** in all manifests with your actual Google Cloud Project ID
2. **Update passwords** in the secretGenerator sections of each overlay
3. **Commit and push** changes to your Git repository
4. **Flux CD automatically applies** the CRDs to create Cloud SQL resources
5. **Config Connector** provisions the actual Google Cloud resources
6. **Cloud SQL Auth Proxy** in deployment connects to the instances

## Benefits of CRD Approach

- **Declarative**: Infrastructure as Code through Kubernetes manifests
- **GitOps Compatible**: All changes tracked in Git with proper review process
- **Environment Consistency**: Same configuration pattern across dev/staging/prod
- **Automated**: No manual gcloud commands needed
- **Rollback Capable**: Can revert infrastructure changes via Git
- **Integrated**: Works seamlessly with existing Kustomize + Flux setup

## Update Kubernetes Manifests

### 1. Update Project ID References

Replace `your-project-id` in the following files with your actual Google Cloud Project ID:

- `k8s/apps/portfolio/base/kustomization.yaml`
- `k8s/apps/portfolio/base/serviceaccount.yaml`
- `k8s/apps/portfolio/overlays/dev/kustomization.yaml`
- `k8s/apps/portfolio/overlays/staging/kustomization.yaml`
- `k8s/apps/portfolio/overlays/prod/kustomization.yaml`

### 2. Update Database Connection Strings

Update the `DATABASE_URL` secrets in each overlay with the actual database passwords:

```yaml
# Example for dev overlay
secretGenerator:
  - name: db-secret
    behavior: merge
    literals:
      - DATABASE_URL=postgresql://portfolio-dev:ACTUAL_DEV_PASSWORD@localhost:5432/portfolio_dev
```

## Instance Tiers and Costs

### db-f1-micro (Smallest/Cheapest)

- **CPU**: 1 shared vCPU
- **RAM**: 0.6 GB
- **Storage**: 10-3,062 GB
- **Cost**: ~$7-15/month (depending on region and usage)
- **Use case**: Development, staging, small applications

### db-g1-small (Recommended for Production)

- **CPU**: 1 shared vCPU
- **RAM**: 1.7 GB
- **Storage**: 10-3,062 GB
- **Cost**: ~$25-35/month
- **Use case**: Small to medium production workloads

## Security Best Practices

1. **Private IP**: Configure Cloud SQL instances with private IP when possible
2. **SSL/TLS**: Enable SSL connections
3. **Authorized Networks**: Restrict access to specific networks
4. **Regular Backups**: Automated backups are configured
5. **Monitoring**: Set up Cloud Monitoring alerts

## Connection String Format

The Cloud SQL Auth Proxy connects to `localhost:5432`, so your connection strings should use:

```
postgresql://username:password@localhost:5432/database_name
```

## Troubleshooting

### Common Issues:

1. **Workload Identity not working**: Ensure the service account annotation is correct
2. **Connection refused**: Check that the Cloud SQL Auth Proxy is running
3. **Authentication failed**: Verify the database user and password
4. **Instance not found**: Check the connection name format: `project:region:instance`

### Debug Commands:

```bash
# Check Cloud SQL instances
gcloud sql instances list

# Check database users
gcloud sql users list --instance=INSTANCE_NAME

# Test connection from Cloud Shell
gcloud sql connect INSTANCE_NAME --user=USERNAME
```

## Monitoring and Maintenance

- **Backups**: Automated daily backups at 03:00 UTC
- **Maintenance**: Sundays at 02:00 UTC
- **Monitoring**: Use Cloud Monitoring for metrics and alerts
- **Logs**: Check Cloud SQL logs for connection issues

For more detailed information, refer to the [Cloud SQL documentation](https://cloud.google.com/sql/docs).
