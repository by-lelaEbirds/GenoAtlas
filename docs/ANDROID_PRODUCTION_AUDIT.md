# GenoAtlas: Auditoria Técnica e Preparação Android

## 1. Mapeamento Total do Projeto

### Stack e tecnologias
- React 18
- Vite 5
- Tailwind CSS 3
- `react-globe.gl` com Three.js
- Capacitor (`app`, `preferences`, `haptics`, `android`, `assets`)
- PWA com `vite-plugin-pwa`

### Estrutura principal
- `src/App.jsx`: orquestra o shell do app, modais, globo, HUD, telas de início e resultado.
- `src/hooks/useGeoGame.js`: núcleo do estado de jogo, persistência, economia, daily, conquistas e fluxo de sessão.
- `src/components/GlobeVisualizer.jsx`: renderização do globo 3D e interação com países.
- `src/components/StartScreen.jsx`: entrada principal, temas, modos e jornada visual.
- `src/components/Modals.jsx`: tutorial, conquistas, loja e créditos.
- `src/components/GameHUD.jsx`: HUD de partida, power-ups e feedbacks.
- `src/constants/*`: GeoJSON, clubes, conquistas, avatares, promo codes e constantes de jogo.
- `src/utils/*`: áudio, storage, gameplay e plataforma.
- `public/assets/*`: ícones, logos, texturas, sons e imagens do globo.
- `.github/workflows/build-apk.yml`: pipeline para geração de APK.
- `capacitor.config.json`: configuração base do shell nativo.

### Fluxo principal do jogo
1. A tela inicial apresenta modos, biomas e progressão.
2. O usuário escolhe um modo.
3. `useGeoGame` monta a sessão, define alvo e reseta estado.
4. `GlobeVisualizer` recebe o clique no polígono e devolve para o hook.
5. O hook pontua, registra streak, toca som, vibra, persiste moedas e progride para o próximo alvo.
6. Ao encerrar, o app mostra `ResultScreen` com pontuação, moedas e reinício.

### Padrão arquitetural atual
- Arquitetura de SPA com estado centralizado em hook customizado.
- Padrão funcional moderno de React, porém ainda concentrado demais em um único hook.
- Sem roteamento formal.
- Sem camada de domínio isolada.
- Boa base para app híbrido, mas originalmente mais próxima de um protótipo evoluído do que de um app mobile maduro.

## 2. Diagnóstico Profundo

### Problemas encontrados
- `[CRÍTICO][corrigido]` Build de produção vulnerável por configuração de minificação inconsistente.
- `[CRÍTICO][corrigido]` Registro manual de service worker conflitando com o fluxo do Vite PWA.
- `[ALTO][corrigido]` Timer, recorde e daily tinham bugs de lógica e sincronização de estado.
- `[ALTO][corrigido]` Persistência incompleta para tema ativo e preferências.
- `[ALTO][corrigido]` `StartScreen` fazia scroll/parallax imperativo e mantinha altura excessiva.
- `[ALTO][corrigido]` Globo estava configurado de forma agressiva demais para mobile e bateria.
- `[ALTO][corrigido]` Loja, tutorial e conquistas tinham inconsistência forte entre light/dark.
- `[ALTO][corrigido]` Pipeline Android instalava dependências fora do contrato do projeto.
- `[MÉDIO][corrigido]` Banner de anúncio não era apropriado para runtime nativo nem para modo leve.
- `[MÉDIO][corrigido]` O app não oferecia controle explícito de som nem de economia de energia.
- `[MÉDIO][corrigido]` Não havia sinalização consistente de progresso da sessão em partida.
- `[MÉDIO][corrigido]` `storage` dependia só de Preferences, reduzindo resiliência no uso web.
- `[BAIXO][corrigido]` Meta tags e shell HTML ainda estavam pouco preparados para instalação e WebView.

## 3. Refatoração Completa Executada

### Núcleo de gameplay
- Extração de helpers para `src/utils/gameplay.js`.
- Correção do encerramento do timer em `00:00`.
- Padronização de chave local de data para desafio diário.
- Fix de closures obsoletas em conquistas e histórico diário.
- Persistência do tema ativo e controle de melhor pontuação anterior.
- Limitação de buffers de rings/arcs para evitar crescimento contínuo.

### Áudio, plataforma e storage
- `src/utils/audio.js`
  - áudio global configurável
  - warmup do contexto
  - bloqueio de reprodução quando oculto
  - melhor comportamento em mobile
- `src/utils/platform.js`
  - detecção de runtime nativo e Android
- `src/utils/storage.js`
  - fallback em `localStorage` além do Preferences

### UI e Android shell
- `src/App.jsx`
  - lazy loading do globo e da tela de resultado
  - atualização dinâmica de `theme-color`
  - classes de shell nativo no `body`
  - painel de ajustes ampliado com som, economia e status Android
- `src/components/Modals.jsx`
  - reescrito para consistência visual e maior clareza estrutural
- `src/components/GameHUD.jsx`
  - adição de barra/estado de progresso da sessão

### Tela inicial e ambiente visual
- `src/components/StartScreen.jsx`
  - dados reais de países
  - redução de custo fora da viewport
  - lazy loading de imagens
  - menor trabalho de scroll no mobile
- `src/components/StartScreenUI/ParallaxBackground.jsx`
  - menos partículas e estrelas em mobile
  - menos custo no modo economia
- `src/components/AdBanner.jsx`
  - fallback local inteligente com “Dica do Dia” quando nativo, leve ou sem AdSense real

## 4. Otimização de Performance

### Renderização
- `GlobeVisualizer` agora usa `Set` para lookup de países acertados.
- Menor `pixelRatio` no mobile e ainda menor no modo economia.
- Atmosfera, bump map e transições reduzidos quando o modo economia está ativo.
- Auto-rotação desativada em cenários onde só gasta bateria.

### Memória
- Arcos e rings limitados por quantidade.
- Floating points com IDs controlados e remoção previsível.
- Menos elementos animados na home.

### Carregamento
- Lazy loading de telas pesadas.
- Imagens principais com `loading="lazy"` e `decoding="async"` quando cabível.
- PWA com registro alinhado ao plugin oficial.

## 5. Melhorias Visuais e UX

### Aplicadas
- Painel de ajustes mais próximo de um app real.
- Dark mode consistente em todos os modais principais.
- Banner convertido para card útil no app nativo.
- Melhor feedback de progresso durante a partida.
- Estados de energia, som e vibração mais claros.

### Direção visual consolidada
- Mantido visual sci-fi/cartográfico.
- Melhor separação entre camada de fundo decorativa e interação jogável.
- Hierarquia de feedback mais forte para combo, progresso e status do app.

## 6. Preparação para Android

### O que já foi feito
- Shell HTML com meta tags de app instalado e WebView.
- `capacitor.config.json` com `backgroundColor` adequado ao app.
- Pipeline Android simplificado e mais coerente com o projeto.
- Criação de `assets/splash.png` como fallback para geração de assets nativos.
- Runtime com detecção nativa/Android para adaptar comportamento.
- Modo economia para reduzir aquecimento e consumo.

### Abordagem escolhida
- Capacitor/WebView é a abordagem correta para este projeto.
- Evita reescrita cara.
- Aproveita 100% do investimento já feito na base React/Vite.
- Permite evoluir para APK rapidamente sem perder velocidade de iteração.

## 7. Upgrades Criativos Implementados

### Já inseridos
- Painel “Android & Energia”.
- Modo economia persistido.
- Som configurável persistido.
- Card local “Dica do Dia” no lugar de anúncio inadequado para runtime nativo.
- Barra de progresso da sessão no HUD.

### Próxima fronteira criativa recomendada
- Missões semanais persistidas.
- Trilha de progressão por continentes.
- Ranking local de streaks.
- Feedback sonoro contextual por continente/bioma.
- Loja com power-ups mais estratégicos.

## 8. Plano de Evolução

### Fase 1
- Build do APK no GitHub Actions.
- Revisar assets gerados do splash e ícone.
- Validar performance em Android fraco.

### Fase 2
- Quebrar `useGeoGame.js` em módulos menores.
- Introduzir testes de regras de pontuação e daily.
- Reduzir peso dos assets PNG/JPG grandes.

### Fase 3
- Missões, progressão e retenção.
- Ranking local e analytics de sessão.
- Empacotamento Android assinado e publicação.

## 9. Arquivos Alterados Nesta Rodada
- `index.html`
- `capacitor.config.json`
- `package.json`
- `.github/workflows/build-apk.yml`
- `src/App.jsx`
- `src/hooks/useGeoGame.js`
- `src/utils/audio.js`
- `src/utils/storage.js`
- `src/utils/platform.js`
- `src/utils/gameplay.js`
- `src/components/GlobeVisualizer.jsx`
- `src/components/StartScreen.jsx`
- `src/components/StartScreenUI/ParallaxBackground.jsx`
- `src/components/AdBanner.jsx`
- `src/components/GameHUD.jsx`
- `src/components/Modals.jsx`
- `src/components/ResultScreen.jsx`
- `src/components/StartScreenUI/BottomNav.jsx`
- `src/main.jsx`
- `src/index.css`
- `assets/splash.png`

## 10. Status Final

O projeto continua web-first na origem, mas agora está significativamente mais próximo de um app Android real:
- melhor shell
- melhor persistência
- melhor configuração de energia
- melhor experiência touch
- melhor comportamento em WebView
- melhor previsibilidade de pipeline

O próximo passo operacional é subir para o GitHub e rodar o workflow de APK com essa nova base.
