# DNS Setup for hugecat.net Domain

This document outlines the DNS configuration required to serve the portfolio application through the hugecat.net domain.

## Overview

The portfolio application has been configured with:

- Google Cloud Load Balancer with CDN
- Managed SSL certificates
- Static IP address
- Multiple domain routing (hugecat.net, www.hugecat.net, portfolio.hugecat.net)

## Required DNS Configuration

### 1. Get the Static IP Address

After the manifests are deployed, get the static IP address:

```bash
kubectl get computeglobaladdress portfolio-portfolio-ip -o jsonpath='{.status.address}'
```

### 2. Configure DNS Records

Add the following DNS records to your hugecat.net domain:

#### A Records

```
hugecat.net                A    <STATIC_IP_ADDRESS>
www.hugecat.net           A    <STATIC_IP_ADDRESS>
portfolio.hugecat.net     A    <STATIC_IP_ADDRESS>
```

#### Alternative: CNAME Records (if using a subdomain)

```
www.hugecat.net           CNAME  hugecat.net
portfolio.hugecat.net     CNAME  hugecat.net
```

## SSL Certificates

The configuration includes Google-managed SSL certificates for:

- hugecat.net
- www.hugecat.net
- portfolio.hugecat.net

Certificates will be automatically provisioned once:

1. DNS records are properly configured
2. Ingress is deployed and healthy
3. Domain validation completes (usually 10-60 minutes)

## CDN Configuration

The setup includes:

- **Frontend Config**: HTTPS redirect, SSL policy
- **Backend Config**: CDN enabled with caching policies
- **Cache Policy**:
  - Static assets cached
  - API responses not cached
  - 404/410 errors cached for 5 minutes

## Health Checks

Load balancer health checks are configured to:

- Check `/api/health` endpoint
- Use HTTP protocol on port 3000
- Check every 15 seconds
- 30-second timeout

## URL Routing

All three domains will serve the same application:

- `https://hugecat.net` → portfolio application
- `https://www.hugecat.net` → portfolio application
- `https://portfolio.hugecat.net` → portfolio application

HTTP traffic is automatically redirected to HTTPS.

## Verification

After DNS propagation (usually 5-15 minutes), verify setup:

```bash
# Check certificate status
kubectl get managedcertificate portfolio-portfolio-ssl-cert

# Check ingress status
kubectl get ingress portfolio-portfolio-ingress

# Test domains
curl -I https://hugecat.net
curl -I https://www.hugecat.net
curl -I https://portfolio.hugecat.net
```

## Troubleshooting

### SSL Certificate Issues

- Verify DNS records point to correct IP
- Wait up to 60 minutes for certificate provisioning
- Check certificate status: `kubectl describe managedcertificate`

### DNS Propagation

- Use `dig` or `nslookup` to verify DNS records
- Global propagation can take up to 48 hours
- Use online DNS checker tools

### Load Balancer Issues

- Check ingress events: `kubectl describe ingress`
- Verify backend service is healthy
- Check firewall rules allow HTTP(S) traffic
