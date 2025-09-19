import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch
import numpy as np

# Criar figura
fig, ax = plt.subplots(1, 1, figsize=(14, 10))
ax.set_xlim(0, 10)
ax.set_ylim(0, 12)
ax.axis('off')

# Cores
cor_input = '#E3F2FD'
cor_processo = '#FFF3E0'
cor_output = '#E8F5E8'
cor_seta = '#666666'

# Função para criar caixas
def criar_caixa(x, y, width, height, text, cor, ax):
    box = FancyBboxPatch((x, y), width, height,
                         boxstyle="round,pad=0.1",
                         facecolor=cor, edgecolor='black', linewidth=1)
    ax.add_patch(box)
    ax.text(x + width/2, y + height/2, text, 
            ha='center', va='center', fontsize=9, weight='bold', wrap=True)

# Função para criar setas
def criar_seta(x1, y1, x2, y2, ax):
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle='->', color=cor_seta, lw=2))

# INPUTS (Topo)
ax.text(5, 11.5, 'SISTEMA DE BRIEFINGS PARA EVENTOS', 
        ha='center', va='center', fontsize=14, weight='bold')

# Inputs principais
criar_caixa(0.5, 9.5, 2.5, 1.5, 'DADOS DO EVENTO\n• Nome/Tema\n• Data/Local\n• Público-alvo\n• Objetivos', cor_input, ax)
criar_caixa(3.5, 9.5, 2.5, 1.5, 'ESTRATÉGIA\nEMPRESA\n• Objetivos\n• Mensagens-chave\n• Produtos foco', cor_input, ax)
criar_caixa(6.5, 9.5, 2.5, 1.5, 'RECURSOS\nDISPONÍVEIS\n• Orçamento\n• Equipe\n• Materiais', cor_input, ax)

# Setas para processamento
criar_seta(1.75, 9.5, 2.5, 8.5, ax)
criar_seta(5, 9.5, 5, 8.5, ax)
criar_seta(7.75, 9.5, 7.5, 8.5, ax)

# PROCESSAMENTO (Meio)
criar_caixa(2, 7.5, 6, 1.5, 'MOTOR DE ANÁLISE E MATCHING\n• Alinhamento estratégico\n• Adequação do público\n• Identificação de oportunidades', cor_processo, ax)

# Seta para geração
criar_seta(5, 7.5, 5, 6.5, ax)

# GERAÇÃO DE CONTEÚDO
criar_caixa(2, 5.5, 6, 1.5, 'GERADOR DE BRIEFINGS\n• Templates personalizados\n• Conteúdo adaptado\n• Validação automática', cor_processo, ax)

# Setas para outputs
criar_seta(3, 5.5, 1.75, 4.5, ax)
criar_seta(5, 5.5, 5, 4.5, ax)
criar_seta(7, 5.5, 8.25, 4.5, ax)

# OUTPUTS (Base)
criar_caixa(0.5, 2.5, 2.5, 2, 'BRIEFING\nCOMUNICAÇÃO\nINTERNA\n• Objetivos\n• Cronograma\n• Responsabilidades\n• KPIs', cor_output, ax)

criar_caixa(3.5, 2.5, 2.5, 2, 'BRIEFING\nCOMUNICAÇÃO\nEXTERNA\n• Mensagens\n• Canais\n• Timeline\n• Materiais', cor_output, ax)

criar_caixa(6.5, 2.5, 2.5, 2, 'BRIEFING\nSTAND\n• Conceito visual\n• Layout\n• Experiência\n• Materiais promo', cor_output, ax)

# Feedback loop
ax.annotate('', xy=(1, 8), xytext=(1, 3),
            arrowprops=dict(arrowstyle='<->', color='red', lw=1.5, linestyle='--'))
ax.text(0.3, 5.5, 'FEEDBACK\nE AJUSTES', ha='center', va='center', 
        fontsize=8, color='red', rotation=90)

plt.title('Fluxo de Informações - Sistema de Briefings para Eventos', 
          fontsize=16, weight='bold', pad=20)

plt.tight_layout()
plt.savefig('/home/participant/carol-project/diagrama-fluxo-briefings.png', 
            dpi=300, bbox_inches='tight')
plt.show()

print("Diagrama criado com sucesso!")