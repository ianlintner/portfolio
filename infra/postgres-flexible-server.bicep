// Minimal Azure Database for PostgreSQL Flexible Server + database + firewall rule
// Follows Bicep best practices: parent property usage, secure parameters, minimal required properties.

@description('Azure region for the PostgreSQL Flexible Server')
param location string = 'eastus'

@description('Server name (3-63 chars, letters/numbers, hyphens allowed)')
param serverName string = 'portfolio-dev-pg'

@secure()
@description('Administrator login password for the server')
param adminPassword string

@description('Administrator username (cannot be azure_superuser, admin, administrator, root, or similar reserved names)')
param adminUser string = 'appuser'

@description('Tier for the server SKU (Burstable | GeneralPurpose | MemoryOptimized)')
param skuTier string = 'Burstable'

@description('SKU name (e.g. B1ms, Standard_D2s_v3). For Burstable, typical small dev: B1ms')
param skuName string = 'B1ms'

@description('Allocated storage in GB (minimum 32)')
param storageSizeGB int = 32

@description('PostgreSQL major version (11, 12, 13, 14)')
param postgresVersion string = '14'

@description('Logical database name to create')
param databaseName string = 'portfolio'

@description('Firewall start IPv4 address (set same as end for single IP)')
param firewallStartIp string

@description('Firewall end IPv4 address (set same as start for single IP)')
param firewallEndIp string

// Flexible Server resource
resource server 'Microsoft.DBforPostgreSQL/flexibleServers@2022-12-01' = {
  name: serverName
  location: location
  sku: {
    name: skuName
    tier: skuTier
  }
  properties: {
    administratorLogin: adminUser
    administratorLoginPassword: adminPassword
    version: postgresVersion
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    highAvailability: {
      mode: 'Disabled'
    }
    storage: {
      storageSizeGB: storageSizeGB
    }
  }
  tags: {
    environment: 'dev'
    app: 'portfolio'
  }
}

// Child database resource
resource db 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2022-12-01' = {
  name: databaseName
  parent: server
  properties: {
    // Default charset/collation omitted (will use server defaults)
  }
}

// Firewall rule permitting a single client IP
resource devIpRule 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2022-12-01' = {
  name: 'dev-ip'
  parent: server
  properties: {
    startIpAddress: firewallStartIp
    endIpAddress: firewallEndIp
  }
}

@description('FQDN of the created server')
output serverFqdn string = server.properties.fullyQualifiedDomainName

// Do not include password in outputs to avoid leaking secrets.
@description('Template for constructing psql connection string (replace <PASSWORD>)')
output connectionStringTemplate string = 'postgresql://${adminUser}:<PASSWORD>@${server.properties.fullyQualifiedDomainName}:5432/${databaseName}?sslmode=require'
