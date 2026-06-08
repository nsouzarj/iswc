# Análise Técnica do Projeto ISWC & CWR (Junho 2026)

## Visão Geral
Esta análise consolida o estado atual do repositório **ISWC**, que evoluiu de um projeto conceitual para uma implementação Full-Stack robusta, fiel aos padrões da indústria de direitos autorais (CISAC, ECAD).

---

## 1. Backend Forte e Fiel aos Padrões CISAC (Java / Spring Boot)

A base do projeto (na pasta `backend`) foi construída com rigor arquitetônico, essencial para um sistema de gestão autoral/financeira:

* **Validações ISO Reais:** A classe `MetadataValidator.java` não se limita a validações textuais. Ela implementa algoritmos criptográficos como o **ISO 15707 MOD 10** (para o ISWC) e o **ISO 7064 MOD 11-2** (para o ISNI), garantindo a integridade dos dígitos verificadores e barrando dados inválidos.
* **Modelagem Relacional (JPA):** O esquema de dados é semanticamente correto para a indústria. Há separação nítida entre `MusicalWork` (a Obra em si), `Recording` (o Fonograma físico) e `Rightsholder` (Autores/Editoras).
* **Fundações para o Motor CWR:** As tabelas `CwrRegistration` e `CwrTransactionLog` já constam na modelagem, deixando o terreno preparado para a futura etapa de parsing e geração de "Flat Files".
* **Segurança Embutida:** A API utiliza `JwtAuthenticationFilter`, consolidando o sistema sob um padrão *Stateless* moderno e protegido.

---

## 2. Frontend Moderno e "À Prova de Erros" (React / Vite)

A interface (na pasta `frontend`) foi além da estética e internalizou as complexidades jurídicas na experiência do usuário, blindando o fluxo:

* **Split Sheet Calculator:** O componente `SplitSheetTab.jsx` atua como um supervisor ativo. Ele monitora as "cotas" em tempo real. Se as divisões de Direitos Mecânicos e de Execução não somarem **exatos 100%**, o painel *Integrity Status Board* notifica a falha, bloqueia a compilação CWR e marca a obra como status **CONFLICT**. Isso mitiga ativamente o risco de *Double Claiming*.
* **Prevenção de Duplicidade:** Impedimentos sistemáticos desabilitam o botão de "Salvar" caso o mesmo compositor seja adicionado múltiplas vezes na matriz de *splits*.

---

## 3. Veredito e Próximos Passos Sugeridos

O MVP (Mínimo Produto Viável) relacionado ao **Cadastro, Cotas e Validação** está sólido. O software atende os preceitos de um "SaaS" (Software as a Service) direcionado para gestão de editoras e selos musicais.

### Desafios Futuros para o Roadmap:
1. **Desenvolvimento do Motor CWR (Exportação/Importação):**
   * Criar os serviços em Java responsáveis por ler obras do banco de dados (que passaram do status `CONFLICT` para `ACTIVE`) e convertê-las para o formato de texto fixo `.cwr` (Header NWR, linhas SWR, etc.), prontas para envio via SFTP para associações (ex: ECAD).
2. **Parsing de ACK:**
   * Lógica para ler os arquivos de retorno enviados pelas associações, atualizando o *ISWC* automaticamente e lidando com rejeições pontuais nas linhas com falha.
3. **Métricas Visuais:**
   * Adicionar no frontend um Dashboard administrativo global, com sumarizações (Obras pendentes vs. Validadas).

---
*Análise gerada como consolidação do status do repositório em auditoria técnica.*
