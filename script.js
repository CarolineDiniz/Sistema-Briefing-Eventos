// Estado da aplicação
let currentSection = 'dashboard';
let eventos = [
    {
        id: 1,
        nome: 'Tech Summit 2024',
        tema: 'Inovação e Tecnologia',
        dataInicio: '2024-03-15',
        dataFim: '2024-03-15',
        local: 'São Paulo - SP',
        publicoEsperado: 500,
        objetivo: 'leads',
        orcamento: 50000,
        mensagem: 'Conectando o futuro através da tecnologia',
        status: 'ativo',
        briefings: {
            interno: { status: 'aprovado', gerado: '2024-03-10' },
            externo: { status: 'pendente', gerado: '2024-03-10' },
            stand: { status: 'aprovado', gerado: '2024-03-10' }
        }
    },
    {
        id: 2,
        nome: 'Marketing Conference',
        tema: 'Marketing Digital',
        dataInicio: '2024-03-22',
        dataFim: '2024-03-22',
        local: 'Rio de Janeiro - RJ',
        publicoEsperado: 300,
        objetivo: 'branding',
        orcamento: 30000,
        mensagem: 'Transformando estratégias em resultados',
        status: 'pendente',
        briefings: {
            interno: { status: 'aprovado', gerado: '2024-03-12' },
            externo: { status: 'rascunho', gerado: null },
            stand: { status: 'rascunho', gerado: null }
        }
    }
];

// Navegação
function showSection(sectionId) {
    // Remover classe active de todas as seções
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remover classe active de todos os links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Mostrar seção selecionada
    document.getElementById(sectionId).classList.add('active');
    
    // Ativar link correspondente
    event.target.classList.add('active');
    
    // Atualizar título da página
    const titles = {
        'dashboard': 'Dashboard',
        'novo-evento': 'Novo Evento',
        'eventos': 'Gerenciar Eventos',
        'briefings': 'Briefings Gerados',
        'templates': 'Templates',
        'relatorios': 'Relatórios'
    };
    
    document.getElementById('page-title').textContent = titles[sectionId];
    currentSection = sectionId;
    
    // Carregar dados específicos da seção
    if (sectionId === 'eventos') {
        carregarEventos();
    } else if (sectionId === 'briefings') {
        carregarBriefings();
    }
}

// Formulário de novo evento
document.getElementById('evento-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        nome: document.getElementById('nome-evento').value,
        tema: document.getElementById('tema-evento').value,
        dataInicio: document.getElementById('data-inicio').value,
        dataFim: document.getElementById('data-fim').value,
        local: document.getElementById('local-evento').value,
        publicoEsperado: document.getElementById('publico-esperado').value,
        objetivo: document.getElementById('objetivo-principal').value,
        orcamento: document.getElementById('orcamento-total').value,
        mensagem: document.getElementById('mensagem-principal').value
    };
    
    // Validação básica
    if (!formData.nome || !formData.dataInicio || !formData.dataFim) {
        alert('Por favor, preencha os campos obrigatórios.');
        return;
    }
    
    // Simular criação do evento
    const novoEvento = {
        id: eventos.length + 1,
        ...formData,
        status: 'ativo',
        briefings: {
            interno: { status: 'gerado', gerado: new Date().toISOString().split('T')[0] },
            externo: { status: 'gerado', gerado: new Date().toISOString().split('T')[0] },
            stand: { status: 'gerado', gerado: new Date().toISOString().split('T')[0] }
        }
    };
    
    eventos.push(novoEvento);
    
    // Mostrar mensagem de sucesso
    mostrarNotificacao('Evento criado com sucesso! Briefings foram gerados automaticamente.', 'success');
    
    // Limpar formulário
    document.getElementById('evento-form').reset();
    
    // Ir para seção de eventos
    showSection('eventos');
});

// Carregar eventos na tabela
function carregarEventos() {
    const tbody = document.getElementById('eventos-table-body');
    tbody.innerHTML = '';
    
    eventos.forEach(evento => {
        const briefingsCount = Object.values(evento.briefings).filter(b => b.status !== 'rascunho').length;
        const totalBriefings = 3;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${evento.nome}</td>
            <td>${formatarData(evento.dataInicio)}</td>
            <td>${evento.local}</td>
            <td><span class="status status-${evento.status}">${evento.status}</span></td>
            <td>${briefingsCount}/${totalBriefings}</td>
            <td>
                <button class="btn-icon" onclick="editarEvento(${evento.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" onclick="verBriefings(${evento.id})">
                    <i class="fas fa-file-alt"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Carregar briefings
function carregarBriefings() {
    const grid = document.getElementById('briefings-grid');
    grid.innerHTML = '';
    
    eventos.forEach(evento => {
        Object.entries(evento.briefings).forEach(([tipo, briefing]) => {
            if (briefing.status !== 'rascunho') {
                const card = document.createElement('div');
                card.className = 'briefing-card';
                
                const tipoNomes = {
                    'interno': 'Comunicação Interna',
                    'externo': 'Comunicação Externa',
                    'stand': 'Briefing do Stand'
                };
                
                card.innerHTML = `
                    <div class="briefing-header">
                        <h3>${tipoNomes[tipo]}</h3>
                        <span class="briefing-type type-${tipo}">${tipo}</span>
                    </div>
                    <div class="briefing-info">
                        <p><strong>Evento:</strong> ${evento.nome}</p>
                        <p><strong>Gerado:</strong> ${formatarData(briefing.gerado)}</p>
                        <p><strong>Status:</strong> <span class="status status-${briefing.status}">${briefing.status}</span></p>
                    </div>
                    <div class="briefing-actions">
                        <button class="btn-small" onclick="visualizarBriefing('${tipo}', ${evento.id})">
                            <i class="fas fa-eye"></i> Visualizar
                        </button>
                        <button class="btn-small" onclick="downloadBriefing('${tipo}', ${evento.id})">
                            <i class="fas fa-download"></i> Download
                        </button>
                        <button class="btn-small" onclick="editarBriefing('${tipo}', ${evento.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                    </div>
                `;
                
                grid.appendChild(card);
            }
        });
    });
}

// Visualizar briefing
function visualizarBriefing(tipo, eventoId) {
    const evento = eventos.find(e => e.id === eventoId);
    if (!evento) return;
    
    const modal = document.getElementById('briefing-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    const tipoNomes = {
        'interno': 'Briefing de Comunicação Interna',
        'externo': 'Briefing de Comunicação Externa',
        'stand': 'Briefing do Stand'
    };
    
    modalTitle.textContent = `${tipoNomes[tipo]} - ${evento.nome}`;
    
    // Gerar conteúdo do briefing baseado no tipo
    let conteudo = '';
    
    if (tipo === 'interno') {
        conteudo = gerarBriefingInterno(evento);
    } else if (tipo === 'externo') {
        conteudo = gerarBriefingExterno(evento);
    } else if (tipo === 'stand') {
        conteudo = gerarBriefingStand(evento);
    }
    
    modalBody.innerHTML = conteudo;
    modal.style.display = 'block';
}

// Gerar conteúdo do briefing interno
function gerarBriefingInterno(evento) {
    return `
        <div class="briefing-content">
            <h3>🎯 Justificativa do Patrocínio</h3>
            <p><strong>Alinhamento Estratégico:</strong> O evento ${evento.nome} está alinhado com nossos objetivos de ${evento.objetivo}, oferecendo uma oportunidade única de conectar com nosso público-alvo.</p>
            <p><strong>Público-Alvo:</strong> Esperamos ${evento.publicoEsperado} participantes interessados em ${evento.tema}.</p>
            <p><strong>Mensagem Principal:</strong> ${evento.mensagem}</p>
            
            <h3>💰 Orçamento</h3>
            <ul>
                <li>Orçamento Total: R$ ${evento.orcamento?.toLocaleString('pt-BR') || 'N/A'}</li>
                <li>Patrocínio: R$ ${(evento.orcamento * 0.4)?.toLocaleString('pt-BR') || 'N/A'}</li>
                <li>Stand e Materiais: R$ ${(evento.orcamento * 0.35)?.toLocaleString('pt-BR') || 'N/A'}</li>
                <li>Equipe e Comunicação: R$ ${(evento.orcamento * 0.25)?.toLocaleString('pt-BR') || 'N/A'}</li>
            </ul>
            
            <h3>📅 Cronograma</h3>
            <ul>
                <li>Definição de materiais: 2 semanas antes do evento</li>
                <li>Treinamento da equipe: 1 semana antes</li>
                <li>Montagem do stand: 1 dia antes</li>
                <li>Evento: ${formatarData(evento.dataInicio)}</li>
                <li>Relatório de resultados: 1 semana após</li>
            </ul>
            
            <h3>📊 KPIs Esperados</h3>
            <ul>
                <li>Leads Gerados: ${Math.floor(evento.publicoEsperado * 0.1)} contatos qualificados</li>
                <li>Engajamento Social: ${Math.floor(evento.publicoEsperado * 2)} interações</li>
                <li>Reuniões Agendadas: ${Math.floor(evento.publicoEsperado * 0.05)} reuniões</li>
            </ul>
        </div>
    `;
}

// Gerar conteúdo do briefing externo
function gerarBriefingExterno(evento) {
    return `
        <div class="briefing-content">
            <h3>🎯 Objetivos de Comunicação</h3>
            <p><strong>Objetivo Principal:</strong> ${evento.objetivo === 'leads' ? 'Geração de leads qualificados' : 'Fortalecimento da marca'}</p>
            <p><strong>Mensagem-Chave:</strong> ${evento.mensagem}</p>
            
            <h3>📱 Estratégia de Canais</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                <tr style="background: #f8f9fa;">
                    <th style="padding: 0.5rem; border: 1px solid #ddd;">Canal</th>
                    <th style="padding: 0.5rem; border: 1px solid #ddd;">Formato</th>
                    <th style="padding: 0.5rem; border: 1px solid #ddd;">Frequência</th>
                </tr>
                <tr>
                    <td style="padding: 0.5rem; border: 1px solid #ddd;">LinkedIn</td>
                    <td style="padding: 0.5rem; border: 1px solid #ddd;">Posts + Stories</td>
                    <td style="padding: 0.5rem; border: 1px solid #ddd;">2x/semana</td>
                </tr>
                <tr>
                    <td style="padding: 0.5rem; border: 1px solid #ddd;">Instagram</td>
                    <td style="padding: 0.5rem; border: 1px solid #ddd;">Posts + Reels</td>
                    <td style="padding: 0.5rem; border: 1px solid #ddd;">3x/semana</td>
                </tr>
                <tr>
                    <td style="padding: 0.5rem; border: 1px solid #ddd;">Email</td>
                    <td style="padding: 0.5rem; border: 1px solid #ddd;">Newsletter</td>
                    <td style="padding: 0.5rem; border: 1px solid #ddd;">1x/semana</td>
                </tr>
            </table>
            
            <h3>📅 Cronograma de Publicações</h3>
            <p><strong>Pré-Evento (4 semanas antes):</strong></p>
            <ul>
                <li>Semana 1: Anúncio do patrocínio</li>
                <li>Semana 2: Apresentação da equipe</li>
                <li>Semana 3: Conteúdo educativo relacionado</li>
                <li>Semana 4: Convite para visitar o stand</li>
            </ul>
            
            <p><strong>Durante o Evento:</strong></p>
            <ul>
                <li>Stories em tempo real</li>
                <li>Posts sobre ativações</li>
                <li>Cobertura de palestras</li>
            </ul>
            
            <p><strong>Pós-Evento:</strong></p>
            <ul>
                <li>Agradecimentos</li>
                <li>Compartilhamento de resultados</li>
                <li>Conteúdo gerado durante o evento</li>
            </ul>
            
            <h3>🏷️ Hashtags</h3>
            <p><strong>Principais:</strong> #${evento.nome.replace(/\s+/g, '')} #NossaMarca</p>
            <p><strong>Secundárias:</strong> #${evento.tema.replace(/\s+/g, '')} #Inovacao #Tecnologia</p>
        </div>
    `;
}

// Gerar conteúdo do briefing do stand
function gerarBriefingStand(evento) {
    return `
        <div class="briefing-content">
            <h3>🎨 Conceito Visual</h3>
            <p><strong>Tema:</strong> ${evento.tema}</p>
            <p><strong>Conceito:</strong> Design moderno e interativo que reflita nossa inovação</p>
            <p><strong>Cores:</strong> Azul corporativo, branco e detalhes em laranja</p>
            
            <h3>📐 Layout do Stand</h3>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <pre style="font-family: monospace; font-size: 0.9rem;">
┌─────────────────────────────────┐
│  RECEPÇÃO    │    DEMO AREA     │
│              │                  │
├──────────────┼──────────────────┤
│   REUNIÃO    │    PRODUTOS      │
│              │                  │
├──────────────┼──────────────────┤
│   STORAGE    │    COFFEE        │
└─────────────────────────────────┘
                </pre>
            </div>
            
            <h3>🎯 Experiência do Visitante</h3>
            <ol>
                <li><strong>Atração:</strong> Display interativo com demonstrações</li>
                <li><strong>Recepção:</strong> Acolhimento personalizado e qualificação</li>
                <li><strong>Demonstração:</strong> Apresentação de produtos/serviços</li>
                <li><strong>Qualificação:</strong> Coleta de dados e interesse</li>
                <li><strong>Follow-up:</strong> Agendamento de próximos passos</li>
            </ol>
            
            <h3>📦 Materiais Promocionais</h3>
            <ul>
                <li>Brindes personalizados: 200 unidades</li>
                <li>Folders informativos: 500 unidades</li>
                <li>Roll-ups: 4 unidades</li>
                <li>Tablets para demonstração: 2 unidades</li>
                <li>Totem interativo: 1 unidade</li>
            </ul>
            
            <h3>👥 Equipe</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
                <tr style="background: #f8f9fa;">
                    <th style="padding: 0.5rem; border: 1px solid #ddd;">Função</th>
                    <th style="padding: 0.5rem; border: 1px solid #ddd;">Responsabilidades</th>
                </tr>
                <tr>
                    <td style="padding: 0.5rem; border: 1px solid #ddd;">Coordenador</td>
                    <td style="padding: 0.5rem; border: 1px solid #ddd;">Gestão geral do stand</td>
                </tr>
                <tr>
                    <td style="padding: 0.5rem; border: 1px solid #ddd;">Vendas</td>
                    <td style="padding: 0.5rem; border: 1px solid #ddd;">Qualificação de leads</td>
                </tr>
                <tr>
                    <td style="padding: 0.5rem; border: 1px solid #ddd;">Técnico</td>
                    <td style="padding: 0.5rem; border: 1px solid #ddd;">Demonstrações técnicas</td>
                </tr>
                <tr>
                    <td style="padding: 0.5rem; border: 1px solid #ddd;">Apoio</td>
                    <td style="padding: 0.5rem; border: 1px solid #ddd;">Recepção e logística</td>
                </tr>
            </table>
            
            <h3>📊 Métricas de Sucesso</h3>
            <ul>
                <li>Visitantes no Stand: Meta de ${Math.floor(evento.publicoEsperado * 0.3)} pessoas</li>
                <li>Leads Qualificados: Meta de ${Math.floor(evento.publicoEsperado * 0.1)} contatos</li>
                <li>Demonstrações: Meta de ${Math.floor(evento.publicoEsperado * 0.05)} apresentações</li>
                <li>Reuniões Agendadas: Meta de ${Math.floor(evento.publicoEsperado * 0.02)} reuniões</li>
            </ul>
        </div>
    `;
}

// Fechar modal
function fecharModal() {
    document.getElementById('briefing-modal').style.display = 'none';
}

// Fechar modal clicando fora
window.onclick = function(event) {
    const modal = document.getElementById('briefing-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Funções auxiliares
function formatarData(data) {
    if (!data) return 'N/A';
    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
}

function editarEvento(id) {
    const evento = eventos.find(e => e.id === id);
    if (evento) {
        // Preencher formulário com dados do evento
        document.getElementById('nome-evento').value = evento.nome;
        document.getElementById('tema-evento').value = evento.tema;
        document.getElementById('data-inicio').value = evento.dataInicio;
        document.getElementById('data-fim').value = evento.dataFim;
        document.getElementById('local-evento').value = evento.local;
        document.getElementById('publico-esperado').value = evento.publicoEsperado;
        document.getElementById('objetivo-principal').value = evento.objetivo;
        document.getElementById('orcamento-total').value = evento.orcamento;
        document.getElementById('mensagem-principal').value = evento.mensagem;
        
        showSection('novo-evento');
    }
}

function verBriefings(id) {
    showSection('briefings');
    // Filtrar briefings do evento específico
    const filterEvento = document.getElementById('filter-evento');
    filterEvento.value = id.toString();
    // Aplicar filtro (implementar se necessário)
}

function downloadBriefing(tipo, eventoId) {
    mostrarNotificacao('Download iniciado! O arquivo será salvo em breve.', 'info');
}

function editarBriefing(tipo, eventoId) {
    mostrarNotificacao('Funcionalidade de edição será implementada em breve.', 'info');
}

function mostrarNotificacao(mensagem, tipo = 'info') {
    // Criar elemento de notificação
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${mensagem}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Adicionar estilos se não existirem
    if (!document.querySelector('.notificacao-styles')) {
        const styles = document.createElement('style');
        styles.className = 'notificacao-styles';
        styles.textContent = `
            .notificacao {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                z-index: 1001;
                animation: slideIn 0.3s ease;
            }
            .notificacao-success { background: #4CAF50; }
            .notificacao-error { background: #f44336; }
            .notificacao-info { background: #2196F3; }
            .notificacao button {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: 1rem;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notificacao);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (notificacao.parentElement) {
            notificacao.remove();
        }
    }, 5000);
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Carregar dados iniciais
    carregarEventos();
    carregarBriefings();
    
    // Configurar filtros
    document.getElementById('filter-evento').addEventListener('change', carregarBriefings);
    document.getElementById('filter-tipo').addEventListener('change', carregarBriefings);
});