# AngelsFit

Aplicativo de treino personalizado distribuído como PWA e carregado pelo aplicativo Android `com.angelsfit.app`.

## O que está incluído

- onboarding e perfil de saúde/treino;
- programa adaptativo de duas semanas;
- sessão persistente com retomada, timer absoluto e descanso em segundo plano;
- séries, carga, repetições, RIR, anotações, substituições e registros de desconforto;
- histórico, métricas, check-in e resposta de recuperação em 24 horas;
- funcionamento offline do shell e dos dados locais;
- armazenamento redundante (`localStorage` + IndexedDB), checksum, snapshot e recuperação;
- migrações sequenciais e verificação segura de atualização;
- adaptador central para recursos Capacitor, com fallback web.

## Desenvolvimento

Requer Node.js `>=22.13.0`.

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm test
```

O app é publicado pelo projeto definido em `.openai/hosting.json`. O arquivo `public/version.json` contém a versão do conteúdo remoto, a versão mínima do aplicativo Android e o schema local.

## Dados e privacidade

Os dados de treino ficam no aparelho e podem ser exportados manualmente. A sincronização remota não está habilitada: o site é público e o APK atual não oferece identidade autenticada, portanto uma base remota multiusuário não seria segura sem primeiro definir autenticação e propriedade dos registros.

## Android

O projeto Android/Capacitor fica em `android/` e empacota uma versão local otimizada e offline. Para sincronizar o conteúdo nativo, use `npm run android:sync`; para gerar o APK, use `npm run android:apk`. A compilação interna usa a chave de desenvolvimento local e não substitui uma assinatura de publicação da Play Store.
