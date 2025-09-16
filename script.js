// Nova versão reestruturada (ES6+)
const seletor = (q) => document.querySelector(q);
const form = seletor('#form-cadastro');
const sucesso = seletor('#mensagem-sucesso');

// Coleção de campos e mensagens
const campos = new Map([
  ['nome', { el: seletor('#nome'), erro: seletor('#erro-nome') }],
  ['email', { el: seletor('#email'), erro: seletor('#erro-email') }],
  ['telefone', { el: seletor('#telefone'), erro: seletor('#erro-telefone') }],
  ['cpf', { el: seletor('#cpf'), erro: seletor('#erro-cpf') }],
  ['nascimento', { el: seletor('#nascimento'), erro: seletor('#erro-nascimento') }],
]);

// 1) Máscaras
const soNumeros = (s) => s.replace(/\D/g, '');
const mascara = {
  telefone: (v) => {
    const n = soNumeros(v).slice(0, 11);
    if (n.length <= 10) return n.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    return n.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  },
  cpf: (v) => soNumeros(v).slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4'),
  data: (v) => soNumeros(v).slice(0, 8).replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3'),
};

// 2) Validações (ordem intencionalmente diferente)
const validar = {
  'obrigatorio': (valor) => valor.trim().length > 0,
  'nome': (valor) => valor.trim().length >= 3,
  'email': (valor) => /.+@.+/.test(valor.trim()),
  'telefone': (valor) => soNumeros(valor).length >= 10,
  'cpf': (valor) => {
    const cpf = soNumeros(valor);
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    const somaDV = (base) => base
      .split('')
      .reduce((acc, dig, i) => acc + Number(dig) * (base.length + 1 - i), 0);
    const dv1 = ((somaDV(cpf.slice(0, 9)) % 11) < 2) ? 0 : 11 - (somaDV(cpf.slice(0, 9)) % 11);
    const dv2 = ((somaDV(cpf.slice(0, 9) + dv1) % 11) < 2) ? 0 : 11 - (somaDV(cpf.slice(0, 9) + dv1) % 11);
    return cpf.endsWith(`${dv1}${dv2}`);
  },
  'maior-de-idade': (valor) => {
    const [d, m, a] = valor.split('/').map(Number);
    if (!d || !m || !a) return false;
    const data = new Date(a, m - 1, d);
    if (Number.isNaN(data) || data.getDate() !== d || data.getMonth() !== m - 1 || data.getFullYear() !== a) return false;
    const hoje = new Date();
    let idade = hoje.getFullYear() - data.getFullYear();
    const mm = hoje.getMonth() - data.getMonth();
    if (mm < 0 || (mm === 0 && hoje.getDate() < data.getDate())) idade--;
    return idade >= 18;
  },
};

// 3) Mensagens
const mensagens = {
  obrigatorio: 'Campo obrigatório.',
  nome: 'Informe pelo menos 3 caracteres.',
  email: 'Email deve conter @ e domínio.',
  telefone: 'Telefone incompleto.',
  cpf: 'CPF inválido.',
  'maior-de-idade': 'É necessário ser maior de 18 anos.',
};

// 4) Helpers de UI
const mostrarErro = (campoEl, erroEl, msg) => {
  campoEl.classList.remove('valid');
  campoEl.classList.add('invalid');
  erroEl.textContent = msg;
};
const limparErro = (campoEl, erroEl) => {
  campoEl.classList.remove('invalid');
  campoEl.classList.add('valid');
  erroEl.textContent = '';
};

// 5) Aplicar máscaras dinamicamente (delegação)
form.addEventListener('input', (e) => {
  const alvo = e.target;
  if (!alvo.matches('[data-campo]')) return;
  const tipoMascara = alvo.getAttribute('data-mascara');
  if (tipoMascara && mascara[tipoMascara]) {
    const pos = alvo.selectionStart;
    const antes = alvo.value;
    alvo.value = mascara[tipoMascara](alvo.value);
    if (document.activeElement === alvo && pos) {
      const diff = alvo.value.length - antes.length;
      alvo.setSelectionRange(pos + Math.max(diff, 0), pos + Math.max(diff, 0));
    }
  }
});

// 6) Validação por campo (blur)
form.addEventListener('blur', (e) => {
  const alvo = e.target;
  if (!alvo.matches('[data-campo]')) return;
  const nomeCampo = alvo.id;
  const erroEl = campos.get(nomeCampo)?.erro;
  const regras = (alvo.getAttribute('data-regras') || '').split(',').map((r) => r.trim()).filter(Boolean);
  for (const regra of regras) {
    const fn = validar[regra];
    if (fn && !fn(alvo.value)) {
      return mostrarErro(alvo, erroEl, mensagens[regra] || 'Valor inválido.');
    }
  }
  limparErro(alvo, erroEl);
}, true);

// 7) Submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  sucesso.textContent = '';
  let invalido = false;

  campos.forEach(({ el, erro }) => {
    const regras = (el.getAttribute('data-regras') || '').split(',').map((r) => r.trim()).filter(Boolean);
    for (const regra of regras) {
      const fn = validar[regra];
      if (fn && !fn(el.value)) {
        mostrarErro(el, erro, mensagens[regra] || 'Valor inválido.');
        invalido = true;
        break;
      }
    }
    if (!invalido) limparErro(el, erro);
  });

  if (invalido) return;
  sucesso.textContent = 'Formulário válido!';
  // Envio real poderia ser implementado aqui via fetch.
});
