# Arquitetura AWS - Sistema de Briefings

## 🏗️ Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                        USUÁRIOS FINAIS                          │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                   CLOUDFRONT CDN                                │
│              (Distribuição Global)                              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                     S3 BUCKET                                   │
│              (Frontend Estático)                                │
│  • index.html  • styles.css  • script.js                       │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                 APPLICATION LOAD BALANCER                       │
│                  (Distribuição de Tráfego)                      │
└─────────────────────┬───────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
┌───────▼──────┐ ┌────▼────┐ ┌──────▼──────┐
│   ECS FARGATE │ │ECS FARGATE│ │ ECS FARGATE │
│   (Backend)   │ │ (Backend) │ │  (Backend)  │
│ Auto Scaling  │ │Auto Scaling│ │Auto Scaling │
└───────┬──────┘ └────┬────┘ └──────┬──────┘
        │             │             │
        └─────────────┼─────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                      RDS AURORA                                 │
│                 (Banco de Dados)                                │
│              Multi-AZ + Read Replicas                           │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                    ELASTICACHE                                  │
│                     (Cache Redis)                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   SERVIÇOS AUXILIARES                           │
├─────────────────────────────────────────────────────────────────┤
│  LAMBDA FUNCTIONS          │  S3 BUCKET (Docs)                  │
│  • Geração de PDFs         │  • Templates                       │
│  • Processamento Briefings │  • Briefings Gerados               │
│  • Notificações           │  • Uploads                          │
├─────────────────────────────────────────────────────────────────┤
│  SES (Email)              │  CLOUDWATCH (Monitoramento)        │
│  • Notificações           │  • Logs e Métricas                 │
│  • Relatórios             │  • Alertas                         │
├─────────────────────────────────────────────────────────────────┤
│  COGNITO                  │  SECRETS MANAGER                    │
│  • Autenticação           │  • Credenciais DB                  │
│  • Autorização            │  • API Keys                        │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 Componentes da Arquitetura

### **Frontend (Camada de Apresentação)**
- **S3 + CloudFront**: Hospedagem estática com CDN global
- **Route 53**: DNS e roteamento
- **Certificate Manager**: SSL/TLS

### **Backend (Camada de Aplicação)**
- **ECS Fargate**: Containers serverless auto-escaláveis
- **Application Load Balancer**: Distribuição de carga
- **API Gateway**: Gerenciamento de APIs REST

### **Banco de Dados**
- **RDS Aurora**: PostgreSQL Multi-AZ
- **ElastiCache**: Redis para cache de sessões
- **S3**: Armazenamento de documentos e templates

### **Processamento**
- **Lambda Functions**: Processamento serverless
- **SQS**: Filas para processamento assíncrono
- **EventBridge**: Orquestração de eventos

### **Segurança e Monitoramento**
- **Cognito**: Autenticação e autorização
- **Secrets Manager**: Gerenciamento de credenciais
- **CloudWatch**: Logs, métricas e alertas
- **WAF**: Proteção contra ataques web

## 💰 Estimativa de Custos (Mensal)

### **Ambiente de Produção**
```
┌─────────────────────┬──────────────┬─────────────┐
│ Serviço             │ Configuração │ Custo (USD) │
├─────────────────────┼──────────────┼─────────────┤
│ ECS Fargate         │ 2 vCPU, 4GB  │ $120        │
│ RDS Aurora          │ db.r5.large  │ $180        │
│ ElastiCache         │ cache.t3.micro│ $15         │
│ S3 + CloudFront     │ 100GB        │ $25         │
│ Lambda              │ 1M execuções │ $20         │
│ Load Balancer       │ 1 ALB        │ $25         │
│ Outros Serviços     │ Diversos     │ $35         │
├─────────────────────┼──────────────┼─────────────┤
│ TOTAL MENSAL        │              │ $420        │
└─────────────────────┴──────────────┴─────────────┘
```

### **Ambiente de Desenvolvimento**
```
┌─────────────────────┬──────────────┬─────────────┐
│ Serviço             │ Configuração │ Custo (USD) │
├─────────────────────┼──────────────┼─────────────┤
│ ECS Fargate         │ 0.5 vCPU, 1GB│ $30         │
│ RDS Aurora          │ db.t3.small  │ $60         │
│ ElastiCache         │ cache.t3.micro│ $15         │
│ S3 + CloudFront     │ 10GB         │ $5          │
│ Lambda              │ 100K exec.   │ $2          │
│ Outros Serviços     │ Diversos     │ $8          │
├─────────────────────┼──────────────┼─────────────┤
│ TOTAL MENSAL        │              │ $120        │
└─────────────────────┴──────────────┴─────────────┘
```

## 🚀 Estratégia de Deploy

### **Infraestrutura como Código**
```yaml
# terraform/main.tf
provider "aws" {
  region = "us-east-1"
}

# VPC e Networking
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  
  name = "briefing-system-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]
  
  enable_nat_gateway = true
  enable_vpn_gateway = false
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "briefing-system"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# RDS Aurora
resource "aws_rds_cluster" "aurora" {
  cluster_identifier = "briefing-system-db"
  engine            = "aurora-postgresql"
  engine_version    = "13.7"
  
  database_name   = "briefings"
  master_username = "admin"
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 7
  preferred_backup_window = "07:00-09:00"
  
  skip_final_snapshot = false
  final_snapshot_identifier = "briefing-system-final-snapshot"
}
```

### **Pipeline CI/CD**
```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Deploy Frontend to S3
      run: |
        aws s3 sync ./frontend s3://briefing-system-frontend
        aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"
    
    - name: Deploy Backend to ECS
      run: |
        aws ecs update-service --cluster briefing-system --service backend --force-new-deployment
```

## 📊 Monitoramento e Alertas

### **CloudWatch Dashboards**
- CPU e Memória dos containers
- Latência das APIs
- Erros de aplicação
- Métricas de banco de dados

### **Alertas Configurados**
- CPU > 80% por 5 minutos
- Erro rate > 5%
- Latência > 2 segundos
- Falhas de deploy

## 🔒 Segurança

### **Controles Implementados**
- WAF com regras OWASP
- Cognito para autenticação
- Secrets Manager para credenciais
- VPC com subnets privadas
- Security Groups restritivos
- Criptografia em trânsito e repouso

### **Compliance**
- Logs de auditoria no CloudTrail
- Backup automático do RDS
- Versionamento no S3
- Monitoramento de segurança

## 🎯 Benefícios da Arquitetura

### **Escalabilidade**
- Auto Scaling baseado em métricas
- Serverless para picos de demanda
- CDN global para performance

### **Disponibilidade**
- Multi-AZ deployment
- Load balancing automático
- Failover de banco de dados

### **Custo-Efetividade**
- Pay-as-you-use com Fargate
- Reserved Instances para RDS
- S3 Intelligent Tiering

### **Manutenibilidade**
- Infraestrutura como código
- CI/CD automatizado
- Monitoramento centralizado
