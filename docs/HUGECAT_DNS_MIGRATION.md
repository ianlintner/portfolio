# hugecat.net DNS Migration Guide

## Current Status

The hugecat.net domain has been configured in Kubernetes with Istio routing and TLS certificates, but **DNS nameservers need to be updated at the domain registrar** for the domain to be fully accessible.

## Issue

The domain registrar (Squarespace Domains) is currently pointing to **old Azure DNS nameservers**:
- ns1-08.azure-dns.com
- ns2-08.azure-dns.net
- ns3-08.azure-dns.org
- ns4-08.azure-dns.info

But the Azure DNS zone is actually hosted on **different nameservers**:
- ns1-07.azure-dns.com
- ns2-07.azure-dns.net
- ns3-07.azure-dns.org
- ns4-07.azure-dns.info

## Required Action

**Update the nameservers at Squarespace Domains:**

1. Log in to your Squarespace domain management
2. Navigate to DNS settings for hugecat.net
3. Update the nameservers to:
   ```
   ns1-07.azure-dns.com
   ns2-07.azure-dns.net
   ns3-07.azure-dns.org
   ns4-07.azure-dns.info
   ```

## Verification

After updating nameservers (allow 1-24 hours for propagation):

```bash
# Check nameservers
dig NS hugecat.net +short

# Should return:
# ns1-07.azure-dns.com.
# ns2-07.azure-dns.net.
# ns3-07.azure-dns.org.
# ns4-07.azure-dns.info.

# Test DNS resolution
dig hugecat.net +short
dig www.hugecat.net +short

# Should both return: 52.182.228.75
```

## Current DNS Records (Already Configured in Azure DNS)

| Record | Type | Value |
|--------|------|-------|
| @ | A | 52.182.228.75 |
| www | A | 52.182.228.75 |
| portfolio | CNAME | www.cat-herding.net |
| _acme-challenge | TXT | (managed by cert-manager) |

## TLS Certificate Status

A certificate request has been created but is waiting for DNS propagation:
- Certificate name: `hugecat-cert`
- Secret name: `hugecat-tls`
- Status: **Pending DNS validation**

Once nameservers are updated and DNS propagates, cert-manager will automatically:
1. Validate the domain via DNS-01 challenge
2. Issue the Let's Encrypt certificate
3. Store it in the `hugecat-tls` Kubernetes secret

## Testing Without DNS (For Immediate Verification)

You can test the site immediately by adding to your `/etc/hosts` file:

```bash
52.182.228.75 hugecat.net www.hugecat.net portfolio.hugecat.net
```

Then visit:
- http://hugecat.net (will work)
- http://www.hugecat.net (will work)
- https://hugecat.net (will fail until cert is issued)

## After DNS Propagation

Once nameservers are updated and propagated:

1. **Monitor certificate issuance:**
   ```bash
   kubectl get certificate hugecat-cert -n default -w
   ```

2. **Check for Ready status:**
   ```bash
   kubectl get certificate hugecat-cert -n default
   # Should show READY=True
   ```

3. **Test HTTPS access:**
   ```bash
   curl -I https://hugecat.net
   curl -I https://www.hugecat.net
   curl -I https://portfolio.hugecat.net
   ```

## Troubleshooting

If certificate doesn't become ready after DNS propagation:

```bash
# Check challenges
kubectl get challenges -n default

# Describe certificate for events
kubectl describe certificate hugecat-cert -n default

# Check certificate request
kubectl get certificaterequest -n default | grep hugecat
kubectl describe certificaterequest <name> -n default
```

## Kubernetes Configuration

All configuration files are located in:
- Gateway: `k8s/apps/portfolio/base/istio-gateway.yaml`
- VirtualService: `k8s/apps/portfolio/base/istio-virtualservice.yaml`
- Certificate: `k8s/apps/portfolio/base/certificate-hugecat.yaml`
- ClusterIssuer: `k8s/clusterissuer-letsencrypt-prod.yaml`

The configuration already includes:
- ✅ Istio Gateway with HTTPS routing
- ✅ VirtualService with host matching
- ✅ Certificate resource
- ✅ ClusterIssuer with Azure DNS solver
- ✅ Azure DNS A records
- ✅ Service principal permissions

**Only missing:** Nameserver update at registrar (manual action required)
