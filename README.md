# Atividade LPW2 - Formulário (versão reestruturada)

Funcionalidades preservadas (com nova organização):
- Nome: mínimo 3 caracteres (classes: `obrigatorio`, `regra-nome`).
- Email: deve conter `@` e domínio (classes: `obrigatorio`, `regra-email`).
- Telefone: máscara automática (fixo/celular) e mínimo 10 dígitos (classes: `mascara-telefone`, `regra-telefone`).
- CPF: máscara automática e validação dos dígitos verificadores (classes: `mascara-cpf`, `regra-cpf`).
- Data de nascimento: máscara `dd/mm/aaaa` e verificação de maioridade (classe: `mascara-data`, `maior-de-idade`).

Estrutura e UX:
- Campos agrupados em `fieldset` com `legend` e textos de ajuda.
- Mensagens de erro por campo com `aria-describedby` e `role=status` para sucesso.
- Classes PT-BR consistentes e atributos `data-*` (`data-campo`, `data-regras`, `data-mascara`).

Arquivos:
- `index.html` — Nova marcação semântica e acessível.
- `style.css` — Layout renovado e feedback visual com `.valid`/`.invalid`.
- `script.js` — Máscaras e validações reescritas: uso de `Map`, delegação de eventos e ordem de funções diferente.

Como testar:
1. Abra o `index.html` no navegador.
2. Digite nos campos: as máscaras aplicam automaticamente.
3. Saia do campo (blur) para ver validação; ao enviar tudo ok, aparece "Formulário válido!".

Notas técnicas:
- ES6+: `const/let`, arrow functions, `Map`, delegação de eventos.
- Envio real não implementado; adicionar `fetch` no submit conforme necessidade.
