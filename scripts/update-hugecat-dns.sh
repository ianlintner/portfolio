#!/bin/bash

# Update Nameservers for hugecat.net at Domain Registrar
# 
# This script provides instructions and verification for updating DNS nameservers
# Manual action required: Update nameservers at Squarespace Domains

set -e

echo "================================================"
echo "hugecat.net DNS Nameserver Update"
echo "================================================"
echo ""

# Get current Azure DNS nameservers
AZURE_NS=$(az network dns zone show --name hugecat.net --resource-group nekoc --query nameServers -o tsv)

echo "✅ Azure DNS Zone nameservers (correct):"
echo "$AZURE_NS" | sed 's/^/   /'
echo ""

# Check current registrar nameservers
echo "🔍 Current registrar nameservers:"
CURRENT_NS=$(dig NS hugecat.net +short | sort)
if [ -z "$CURRENT_NS" ]; then
    echo "   ⚠️  Unable to resolve nameservers (DNS not propagated or misconfigured)"
else
    echo "$CURRENT_NS" | sed 's/^/   /'
fi
echo ""

# Compare
AZURE_NS_SORTED=$(echo "$AZURE_NS" | sort)
if [ "$AZURE_NS_SORTED" = "$CURRENT_NS" ]; then
    echo "✅ Nameservers match! DNS is correctly configured."
    echo ""
    
    # Test DNS resolution
    echo "🔍 Testing DNS resolution..."
    IP=$(dig +short hugecat.net A | head -1)
    if [ "$IP" = "52.182.228.75" ]; then
        echo "✅ hugecat.net resolves to correct IP: $IP"
    else
        echo "⚠️  hugecat.net resolves to: $IP (expected: 52.182.228.75)"
    fi
    
    # Check certificate
    echo ""
    echo "🔍 Checking TLS certificate status..."
    CERT_STATUS=$(kubectl get certificate hugecat-cert -n default -o jsonpath='{.status.conditions[?(@.type=="Ready")].status}' 2>/dev/null || echo "NotFound")
    if [ "$CERT_STATUS" = "True" ]; then
        echo "✅ Certificate is ready!"
        
        # Test HTTPS
        echo ""
        echo "🔍 Testing HTTPS connectivity..."
        if curl -sI --max-time 5 https://hugecat.net >/dev/null 2>&1; then
            echo "✅ https://hugecat.net is accessible"
        else
            echo "⚠️  https://hugecat.net is not accessible yet"
        fi
    else
        echo "⏳ Certificate is not ready yet (Status: $CERT_STATUS)"
        echo "   This is normal - cert-manager is waiting for DNS propagation"
        echo "   Run: kubectl get certificate hugecat-cert -n default -w"
    fi
else
    echo "❌ Nameservers DO NOT match!"
    echo ""
    echo "📋 REQUIRED ACTION:"
    echo "   1. Log in to Squarespace Domains: https://account.squarespace.com"
    echo "   2. Navigate to: Domains → hugecat.net → DNS Settings"
    echo "   3. Click 'Use Custom Nameservers'"
    echo "   4. Update nameservers to:"
    echo ""
    echo "$AZURE_NS" | sed 's/^/      /'
    echo ""
    echo "   5. Save changes"
    echo "   6. Wait 1-24 hours for DNS propagation"
    echo "   7. Re-run this script to verify"
    echo ""
    echo "🔧 While waiting, you can test locally by adding to /etc/hosts:"
    echo "   52.182.228.75 hugecat.net www.hugecat.net portfolio.hugecat.net"
fi

echo ""
echo "================================================"
