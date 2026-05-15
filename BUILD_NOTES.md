# Build Notes — v1.0.2_20260515_1248

Correção direta do problema reportado no print:
os botões PEDIDOS / COMANDOS / COMMS / SAFETY estavam globais e persistentes.

Agora o body recebe `game-active` apenas no gameplay. Fora do gameplay:
- não existe dock mobile visível
- a rolagem é liberada
- menu e lobby voltam a funcionar.
