// ============================================================
// ESTADO GLOBAL
// ============================================================
let listaProdutos = JSON.parse(localStorage.getItem('produtos')) || [];

// ============================================================
// FUNÇÕES DE EXIBIÇÃO
// ============================================================

// Função para exibir todos os produtos inicialmente ou após filtragem
function exibirProdutos(produtos) {
    const container = document.getElementById("lista");
    container.innerHTML = "";

    if (produtos.length === 0) {
    const p = document.createElement("p");
    p.textContent = "Nenhum produto cadastrado.";
    p.classList.add("nenhum-produto"); // adiciona classe para centralizar via CSS

    container.innerHTML = ""; // limpa qualquer conteúdo antigo
    container.appendChild(p);

    return; // sai da função
}

    produtos.forEach(prod => {
        const div = document.createElement('div');
        div.classList.add('card');

        div.innerHTML = `
            ${prod.imagem ? `<img src="${prod.imagem}">` : `<div style="height:150px; background:#eee; border-radius:6px;"></div>`}
            <h3>${prod.nome}</h3>
            <p><strong>Categoria:</strong> ${prod.categoria}</p>
            <p><strong>Venda:</strong> R$ ${parseFloat(prod.precoVenda).toFixed(2)}</p>
            <p><strong>Custo:</strong> R$ ${parseFloat(prod.precoCusto).toFixed(2)}</p>
            <p><strong>Estoque:</strong> ${prod.estoque}</p>
            <p><small>Cadastrado em: ${prod.dataCadastro}</small></p>
            <button class="delete-btn" onclick="excluirProduto(${prod.id})">🗑 Excluir</button>
        `;

        container.appendChild(div);
    });
}

// Função para filtrar produtos por categoria
function filtrarCards(categoria, botao) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];

    // Atualiza aba ativa
    document.querySelectorAll("#abas-container .aba").forEach(b => b.classList.remove("aba-ativa"));
    if (botao) botao.classList.add("aba-ativa");

    const produtosFiltrados = categoria === "Todos"
        ? produtos
        : produtos.filter(p => p.categoria === categoria);

    exibirProdutos(produtosFiltrados);
}

// ============================================================
// FUNÇÃO DE EXCLUSÃO
// ============================================================
function excluirProduto(id) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        const index = listaProdutos.findIndex(prod => prod.id === id);
        if (index !== -1) {
            listaProdutos.splice(index, 1);
            localStorage.setItem('produtos', JSON.stringify(listaProdutos));
            filtrarCards("Todos", document.querySelector(".aba-ativa"));
        }
    }
}

// ============================================================
// MINI-DASHBOARD
// ============================================================
function atualizarDashboard() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];

    const totalProdutos = produtos.length;
    const valorEstoque = produtos.reduce((soma, prod) => soma + (parseFloat(prod.precoCusto) * parseFloat(prod.estoque)), 0);
    const lucroPrevisto = produtos.reduce((soma, prod) => {
        const margem = parseFloat(prod.precoVenda) - parseFloat(prod.precoCusto);
        return soma + (margem * parseFloat(prod.estoque));
    }, 0);

    document.getElementById('dash-total').textContent = totalProdutos;
    document.getElementById('dash-estoque').textContent = valorEstoque.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('dash-lucro').textContent = lucroPrevisto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Exibe todos os produtos ao carregar a página
    filtrarCards("Todos", document.querySelector(".aba-ativa"));

    // Atualiza mini-dashboard
    atualizarDashboard();
});