let listaProdutos = JSON.parse(localStorage.getItem('produtos')) || [];

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('productForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        cadastrarNovoProduto(e.target);
    });

    const btnUpload = document.getElementById("btnUpload");
    const fileInput = document.getElementById("fileInput");
    const fileName = document.getElementById("fileName");

    btnUpload.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", () => {
        fileName.textContent = fileInput.files.length > 0 
            ? fileInput.files[0].name 
            : "";
    });
});

function cadastrarNovoProduto(formElement) {

    const formData = new FormData(formElement);

    const precoCusto = parseFloat(formData.get('costPrice')) || 0;

    const novoProduto = {
        id: Date.now(),
        nome: formData.get('nomeProduto') || "Sem nome",
        descricao: formData.get('descricao') || "Nenhuma descrição informada",
        categoria: formData.get('categoria') || "Sem categoria",
        precoCusto: precoCusto,
        precoVenda: precoCusto * 1.25,
        estoque: parseInt(formData.get('estoque')) || 0,
        dataCadastro: new Date().toLocaleDateString('pt-BR'),
        imagem: null
    };

    const file = formData.get('upload');

    if (file && file.size > 0) {
        const reader = new FileReader();

        reader.onload = function(e) {
            novoProduto.imagem = e.target.result;
            salvarProduto(novoProduto);
        };

        reader.readAsDataURL(file);
    } else {
        salvarProduto(novoProduto);
    }
}

function salvarProduto(produto) {
    listaProdutos.push(produto);

    localStorage.setItem('produtos', JSON.stringify(listaProdutos));

    console.log("Lista Atualizada:", listaProdutos);
    alert(`Produto "${produto.nome}" cadastrado com sucesso!`);

    document.getElementById('productForm').reset();
    document.getElementById('fileName').textContent = "";
}

function exibirPerfil() {
    alert("Perfil do usuário");
}

function atualizarPrecoVenda() {
    const custo = parseFloat(document.querySelector('input[name="costPrice"]').value) || 0;

    const venda = custo * 1.25;
    
    document.getElementById("salePrice").innerText =
        "R$ " + venda.toFixed(2);
}

const inputBuscaIndex = document.getElementById('search-input');


inputBuscaIndex.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        executarBusca();
    }
});

function executarBusca() {
    const valor = inputBuscaIndex.value.trim();
    
    if (valor !== "") {
       
        window.location.href = `produtos.html?busca=${encodeURIComponent(valor)}`;
    } else {
        
        window.location.href = `produtos.html`;
    }
}