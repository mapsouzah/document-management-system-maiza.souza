---
description: Analisa e adapta o projeto para execução em arquitetura Arm.
name: migrar-arm
argument-hint: ambiente e arquitetura Arm de destino
agent: agent
---

# Migrar projeto para Arm

Analise e adapte o projeto para executar em `${input:alvo:ambiente e arquitetura Arm de destino}`. Preserve a compatibilidade existente com x86 quando possível e siga as instruções do repositório.

1. Identifique as linguagens, plataformas suportadas, comandos de build e testes, imagens de container e dependências relevantes. Verifique flags de compilação, binários, bibliotecas e código específicos de x86.
2. Verifique se o servidor Arm MCP e suas ferramentas estão disponíveis. Quando disponíveis, use `check_image` ou `skopeo` para verificar imagens, `migrate_ease_scan` com o scanner adequado para analisar o código e `knowledge_base_search` para esclarecer compatibilidade e alternativas Arm. Use outras ferramentas de compatibilidade disponíveis para consultar os nomes e versões corretos dos pacotes, sem confundir versões de clientes e servidores.
3. Caso o Arm MCP não esteja disponível, informe a limitação e use evidências locais e documentação confiável para as verificações possíveis. Não afirme que uma imagem, dependência ou migração foi validada sem evidências. Para configurar o servidor, consulte o [guia de instalação do Arm MCP](https://github.com/arm/mcp/blob/main/agent-integrations/agent-install-instructions.md).
4. Aplique mudanças necessárias e fundamentadas em imagens, dependências, configurações e código, preservando comportamento e interfaces. Ao substituir intrínsecos, escolha alternativas suportadas pelo alvo; índices de lanes NEON devem ser constantes em tempo de compilação. Não pressuponha suporte a SVE ou SVE2 sem verificar o processador de destino.
5. Execute os testes e o build aplicáveis. Valide em Arm ou em ambiente de compilação cruzada quando disponível; caso contrário, relate explicitamente o que não foi validado. Execute benchmarks existentes quando fizer sentido e compare resultados apenas em condições equivalentes.

Apresente um resumo das alterações, da compatibilidade verificada, dos testes executados, dos riscos e das verificações pendentes. Não altere a política de armazenamento local do projeto nem implemente infraestrutura externa sem solicitação explícita.