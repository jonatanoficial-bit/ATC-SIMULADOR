# SKYWARD CONTROL — v0.9.5_20260514_2138

## Evolução
- Sistema inicial de combustível por aeronave.
- Estados FUEL: OK, LOW, EMERGENCY e CRITICAL.
- MAYDAY automático por combustível crítico.
- Emergências operacionais aleatórias: MEDICAL / ENGINE.
- Painel FUEL / EMERG no dock SAFETY.
- Etiquetas do radar mostram combustível.
- Aeronave selecionada mostra FUEL e DMG.
- Pouso em clima severo ou alta velocidade pode gerar inspeção/dano.
- Safety Advisor considera combustível mínimo e emergências.
- Recursos antequebra e Safe Mode preservados.

## Testes
- node --check main.js
- verificação de arquivos essenciais
- validação dos JSONs
- integridade do ZIP
