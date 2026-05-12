// ============================================================
// ESTADO GLOBAL
// ============================================================

let listaProdutos = JSON.parse(localStorage.getItem('produtos')) || [];
let arquivoImagem = null;

// ============================================================
// INICIALIZAÇÃO — EVENTOS DO FORMULÁRIO E DROPZONE
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    const form      = document.getElementById('productForm');
    const fileInput = document.getElementById('fileInput');
    const fileName  = document.getElementById('fileName');
    const dropzone  = document.getElementById('dropzone');

    // ----- Formulário -----
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        cadastrarNovoProduto(e.target);
    });

    form.addEventListener('reset', () => {
        arquivoImagem = null;
        fileName.textContent = '';
    });

    // ----- Seletor de arquivo -----
    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            arquivoImagem        = fileInput.files[0];
            fileName.textContent = arquivoImagem.name;
        } else {
            fileName.textContent = '';
        }
    });

    // ----- Drag & Drop -----
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('over');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('over');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('over');

        const arquivo = e.dataTransfer.files[0];

        if (arquivo && arquivo.type.startsWith('image/')) {
            arquivoImagem        = arquivo;
            fileName.textContent = arquivo.name;

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(arquivo);
            fileInput.files = dataTransfer.files;
        }
    });

    // ----- Inicializa mostrando todos os produtos -----
    filtrarCards("Todos", document.querySelector(".aba-ativa"));
});

// ============================================================
// FUNÇÕES
// ============================================================

// ----- Compressão de imagem -----
function comprimirImagem(arquivo, maxLargura = 800, maxTamanhoKB = 100) {
    return new Promise((resolve) => {

        const reader = new FileReader();
        reader.readAsDataURL(arquivo);

        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;

            img.onload = () => {

                let largura = img.width;
                let altura  = img.height;

                if (largura > maxLargura) {
                    altura  = Math.round((altura * maxLargura) / largura);
                    largura = maxLargura;
                }

                const canvas = document.createElement('canvas');
                canvas.width  = largura;
                canvas.height = altura;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, largura, altura);

                let qualidade = 0.9;
                let resultado;

                do {
                    resultado         = canvas.toDataURL('image/jpeg', qualidade);
                    const tamanhoKB   = (resultado.length * 0.75) / 1024;

                    if (tamanhoKB <= maxTamanhoKB) break;
                    qualidade -= 0.05;

                } while (qualidade > 0.1);

                resolve(resultado);
            };
        };
    });
}

// ----- Cadastro -----
async function cadastrarNovoProduto(formElement) {

    const formData   = new FormData(formElement);
    const precoCusto = parseFloat(formData.get('costPrice')) || 0;

    const novoProduto = {
        id:           Date.now(),
        nome:         formData.get('nomeProduto')  || 'Sem nome',
        categoria:    formData.get('categoria')    || 'Sem categoria',
        descricao:    formData.get('descricao')    || '',
        precoCusto:   precoCusto,
        precoVenda:   precoCusto * 1.25,
        estoque:      parseInt(formData.get('estoque')) || 0,
        dataCadastro: new Date().toLocaleDateString('pt-BR'),
        imagem:       null
    };

    const file = arquivoImagem || formData.get('upload');

    if (file && file.size > 0) {
        novoProduto.imagem = await comprimirImagem(file);
        arquivoImagem = null;
    }

    salvarProduto(novoProduto);

    // Atualiza os cards para refletir o novo produto
    filtrarCards("Todos", document.querySelector(".aba-ativa"));
}

// ----- Persistência -----
function salvarProduto(produto) {
    listaProdutos.push(produto);
    localStorage.setItem('produtos', JSON.stringify(listaProdutos));

    console.log('Lista Atualizada:', listaProdutos);

    alert(`Produto "${produto.nome}" cadastrado com sucesso!`);

    document.getElementById('productForm').reset();
    document.getElementById('fileName').textContent = '';
}

