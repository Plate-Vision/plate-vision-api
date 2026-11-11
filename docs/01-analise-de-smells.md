# 01 — Dossiê, diagnóstico e análise de smells

## Identificação e baseline anterior à refatoração

Equipe: Arthur Ghizi, Augusto Preis e Gabriel Jorge. [Repositório público](https://github.com/Plate-Vision/plate-vision-api). Original congelado: [`b360df12edf9c347f981130fdcd0b61266869822`](https://github.com/Plate-Vision/plate-vision-api/commit/b360df12edf9c347f981130fdcd0b61266869822). A descrição do domínio e a stack estão no [README](../README.md). O scope foi escolhido pelo usuário; a aprovação do professor permanece pendente.

A medição inicial com `cloc` 2.06 contou o TypeScript de `src/`, excluindo testes, dependências, gerados e lockfiles. A API completa tem 7.564 linhas, inclusive migrations/seeds; mesmo sem essas pastas tem 6.958 linhas. Não há redução artificial da contagem total para enquadrar o projeto. O recorte de 627 linhas inclui 12 arquivos; os caminhos exatos estão em `scope.paths` no [baseline](../reports/baseline.json).

```text
                    files    blank    comment    code
TypeScript / src      226     1164        139    7564
TypeScript / recorte   12       82          0     627
```

Reprodução: `npm run report:baseline`. O script arquiva `original` em uma pasta temporária e mede essa fonte com as versões travadas de cloc/ESLint/Prettier. O pacote npm `cloc@2.6.0` embute a CLI **1.86**, que reproduziu as mesmas contagens da medição inicial com a CLI do sistema **2.06**; os relatórios registram a versão efetivamente executada. Foram medidos **409 erros de lint** (407 de formatação, dois `prefer-const`) e **15 avisos de imports/parâmetros não utilizados**. A versão original não contém suíte nem comando de cobertura; a cobertura inicial é **indisponível**, não um 0% inventado. Complexidade ciclomática não foi medida. A primeira suíte adicionada, ainda antes das mudanças semânticas, passou em 53 cenários e mediu 20,46% de cobertura global.

## Catálogo inicial

As localizações abaixo apontam para o código congelado. As cinco categorias estão representadas; nem todos os smells são eliminados neste recorte.

| ID  | Smell                                        | Categoria                      | Local original                                                                                                                                                                                                                                                                                         | Impacto                                                                                        | Resultado                                                        |
| --- | -------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| S01 | Long Method                                  | Inchaços                       | [`src/modules/plate-reading/domain/services/providers/processor-plate-reading.provider.ts:42`](https://github.com/Plate-Vision/plate-vision-api/blob/b360df12edf9c347f981130fdcd0b61266869822/src/modules/plate-reading/domain/services/providers/processor-plate-reading.provider.ts#L42)             | Loop mistura criação de veículo, regra de serviço, dois DTOs e marcação em lote.               | Eliminado: composição por leitura e lote                         |
| S02 | Inappropriate Intimacy                       | Acopladores                    | [`src/modules/plate-reading/domain/services/providers/processor-plate-reading.provider.ts:12`](https://github.com/Plate-Vision/plate-vision-api/blob/b360df12edf9c347f981130fdcd0b61266869822/src/modules/plate-reading/domain/services/providers/processor-plate-reading.provider.ts#L12)             | Providers dependem de fachadas completas e de volta no serviço que os constrói.                | Eliminado nos providers alterados; fachadas públicas preservadas |
| S03 | Duplicate Code                               | Dispensáveis                   | [`src/modules/parking-record/domain/services/providers/create-parking-record-manual.provider.ts:74`](https://github.com/Plate-Vision/plate-vision-api/blob/b360df12edf9c347f981130fdcd0b61266869822/src/modules/parking-record/domain/services/providers/create-parking-record-manual.provider.ts#L74) | Validação de entrada/saída e mensagem repetidas em três operações.                             | Eliminado: helper compartilhado                                  |
| S04 | Shotgun Surgery                              | Impedidores de mudança         | [`src/modules/parking-record/domain/services/providers/create-parking-record-manual.provider.ts:74`](https://github.com/Plate-Vision/plate-vision-api/blob/b360df12edf9c347f981130fdcd0b61266869822/src/modules/parking-record/domain/services/providers/create-parking-record-manual.provider.ts#L74) | Alterar a regra ou a mensagem de período exigia editar três providers.                         | Reduzido: regra central; políticas de fallback ainda distintas   |
| S05 | Data Clumps                                  | Inchaços                       | [`src/modules/plate-reading/domain/services/providers/processor-plate-reading.provider.ts:54`](https://github.com/Plate-Vision/plate-vision-api/blob/b360df12edf9c347f981130fdcd0b61266869822/src/modules/plate-reading/domain/services/providers/processor-plate-reading.provider.ts#L54)             | Veículo, instante e leitura de entrada se repetem nos dois DTOs.                               | Eliminado nesse ponto: parkingEntryData                          |
| S06 | Dead Code                                    | Dispensáveis                   | [`src/modules/vehicle/domain/services/providers/create-vehicle-ia.provider.ts:3`](https://github.com/Plate-Vision/plate-vision-api/blob/b360df12edf9c347f981130fdcd0b61266869822/src/modules/vehicle/domain/services/providers/create-vehicle-ia.provider.ts#L3)                                       | Imports não usados e resultados temporários sem responsabilidade adicional.                    | Eliminado nos pontos tratados; 15 avisos originais removidos     |
| S07 | Primitive Obsession: códigos mágicos         | Inchaços                       | [`src/modules/plate-reading/domain/services/providers/processor-plate-reading.provider.ts:38`](https://github.com/Plate-Vision/plate-vision-api/blob/b360df12edf9c347f981130fdcd0b61266869822/src/modules/plate-reading/domain/services/providers/processor-plate-reading.provider.ts#L38)             | 404/412/422 escondem o significado das falhas do domínio.                                      | Eliminado no recorte: HttpStatus                                 |
| S08 | Switch Statements: seleção repetida por tipo | Abusos de orientação a objetos | [`src/modules/customer/application/validators/is-document.validator.ts:23`](https://github.com/Plate-Vision/plate-vision-api/blob/b360df12edf9c347f981130fdcd0b61266869822/src/modules/customer/application/validators/is-document.validator.ts#L23)                                                   | Dois encadeamentos if selecionam validação e mensagem por FI/JU; mudança de tipo atinge ambos. | Remanescente fora do recorte; validator protegido por testes     |

S08 usa condicionais `if` por tipo, não a sintaxe literal `switch`; a classificação descreve a duplicação da seleção de comportamento. Ela é um diagnóstico fora do fluxo escolhido, sem alteração de produção neste trabalho.

## Cinco mudanças principais

### S01 — Long Method

Categoria: inchaços. Técnica: **Extract Method**, grupo composição de métodos. [PR 4](https://github.com/Plate-Vision/plate-vision-api/pull/30). Proteção: `test/plate-reading.spec.ts`, execução serial, mesma transação e marcação somente após o lote.

Antes (`processPlates`):

```ts
    for (const plate of plates) {
      const vehicle = await this.vehicleService.createIa.execute({
        dto: { licensePlate: plate.licensePlate },
        queryRunner,
      });

      if (vehicle && vehicle.isServiceVehicle === false) {
        await this.parkingRecordService.upsertIa.execute({
```

Depois: o lote chama `processPlate`; a regra individual usa uma guard clause e monta os DTOs.

```ts
  private async processPlates(
    plates: PlateReadingEntity[],
    queryRunner: QueryRunner,
  ): Promise<void> {
    for (const plate of plates) {
      await this.processPlate(plate, queryRunner);
    }
    const ids = plates.map((item) => item.id);
    await this.updatePlateReading.execute({ ids, queryRunner });
```

### S02 — Inappropriate Intimacy

Categoria: acopladores. Técnica: **Remove Middle Man**, removendo o acesso indireto às operações pelas fachadas dentro desses providers. [PR 3](https://github.com/Plate-Vision/plate-vision-api/pull/29). Proteção: `test/service-wiring.spec.ts`, incluindo a montagem real pelo Nest.

Antes:

```ts
  public constructor(
    private readonly plateReadingService: PlateReadingService,
    private readonly vehicleService: VehicleService,
    private readonly parkingRecordService: ParkingRecordService,
    private readonly plateReadingRepository: PlateReadingRepository,
  ) {}
```

Depois:

```ts
  public constructor(
    private readonly findManyPlateReading: FindManyPlateReadingProvider,
    private readonly updatePlateReading: UpdatePlateReadingProvider,
    private readonly createVehicle: CreateVehicleIaProvider,
    private readonly upsertParkingRecord: UpsertParkingRecordIaProvider,
    private readonly plateReadingRepository: PlateReadingRepository,
  ) {}
  public async execute() {
```

A demonstração HTTP detectou que capturar `parkingRecordService.upsertIa` cedo demais recebia `undefined` por causa de um `forwardRef` desnecessário. O PR 3 também remove essa injeção antecipada; o teste real do Nest falhou antes da correção e passou depois. Os `forwardRef` de módulos são preservados.

### S03 — Duplicate Code

Categoria: dispensáveis. Técnicas: **Extract Method** e **Move Method**, grupos composição e movimentação de recursos. [PR 2](https://github.com/Plate-Vision/plate-vision-api/pull/28). Proteção: `test/parking-record.spec.ts`, período inválido/igual, datas ausentes e diferenças entre `null` e `undefined`.

Antes: três operações repetiam a comparação e o erro.

```ts
  private async validateDate(dto: CreateParkingRecordDTO) {
    if (dto.entryTime && dto.exitTime && dto.exitTime < dto.entryTime) {
      throw new HttpException(
        'A data e hora de saída não pode ser menor que a data e hora de entrada',
        412,
      );
    }
  }
```

Depois, [helper compartilhado](../src/modules/parking-record/domain/services/helpers/validate-parking-period.ts):

```ts
import { HttpException, HttpStatus } from '@nestjs/common';

export function validateParkingPeriod(
  entryTime: Date,
  exitTime?: Date | null,
): void {
  if (entryTime && exitTime && exitTime < entryTime) {
    throw new HttpException(
      'A data e hora de saída não pode ser menor que a data e hora de entrada',
      HttpStatus.PRECONDITION_FAILED,
    );
  }
}
```

Cada provider continua resolvendo as suas datas antes de chamar o helper. A atualização manual usa fallback somente para `undefined`; a atualização por IA mantém `||`.

### S05 — Data Clumps

Categoria: inchaços. Técnica: **Extract Variable**, composição de métodos. [PR 4](https://github.com/Plate-Vision/plate-vision-api/pull/30). Proteção: `test/plate-reading.spec.ts`, payloads de entrada/saída e IDs das leituras.

Antes:

```ts
          dto: {
            vehicle: vehicle,
            entryTime: plate.createdAt,
            entryReadingId: plate.id,
          },
          dtoUpdate: {
            vehicle: vehicle,
            entryTime: plate.createdAt,
            entryReadingId: plate.id,
            exitTime: plate.createdAt,
            exitReadingId: plate.id,
```

Depois:

```ts
const parkingEntryData = {
  vehicle,
  entryTime: plate.createdAt,
  entryReadingId: plate.id,
};

await this.upsertParkingRecord.execute({
  dto: parkingEntryData,
  dtoUpdate: {
    ...parkingEntryData,
    exitTime: plate.createdAt,
    exitReadingId: plate.id,
  },
  queryRunner,
});
```

### S07 — Códigos mágicos

Categoria: inchaços. Técnica: **Replace Magic Number with Symbolic Constant**, organização de dados. [PR 5](https://github.com/Plate-Vision/plate-vision-api/pull/31). Proteção: testes de falha do processador e de validação do estacionamento.

Antes:

```ts
throw new HttpException('Falha ao processar as leituras de placa', 404);
```

Depois:

```ts
throw new HttpException(
  'Falha ao processar as leituras de placa',
  HttpStatus.NOT_FOUND,
);
```

## Plano executado e métricas

| Ordem/PR                                                      | Entrega                                                              | Grupo de técnicas                                                            |
| ------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [1](https://github.com/Plate-Vision/plate-vision-api/pull/27) | Ferramentas, caracterização, nomes claros e transformações síncronas | Composição de métodos: Rename Method                                         |
| [2](https://github.com/Plate-Vision/plate-vision-api/pull/28) | Helper de período                                                    | Composição e movimentação: Extract/Move Method                               |
| [3](https://github.com/Plate-Vision/plate-vision-api/pull/29) | Colaboradores específicos e inicialização correta do Nest            | Simplificação de chamadas: Remove Middle Man                                 |
| [4](https://github.com/Plate-Vision/plate-vision-api/pull/30) | Processamento individual e dados de entrada compartilhados           | Composição: Extract Method/Variable                                          |
| [5](https://github.com/Plate-Vision/plate-vision-api/pull/31) | Constantes HTTP                                                      | Organização de dados: Replace Magic Number                                   |
| [6](https://github.com/Plate-Vision/plate-vision-api/pull/32) | Guard clauses, retornos diretos, cobertura global e documentação     | Simplificação de condicionais: Replace Nested Conditional with Guard Clauses |

São **oito ocorrências catalogadas em cinco categorias**: **seis eliminadas nos pontos tratados**, **uma reduzida** (S04) e **uma remanescente fora do recorte** (S08). Não é uma varredura completa do repositório. Há pelo menos quatro grupos do catálogo demonstrados independentemente do enquadramento da simplificação de chamadas: composição, movimentação, organização de dados e simplificação de condicionais.

## Riscos, limites e não objetivos

O esquema, SQL, rotas, autenticação de produção e engine/OCR não são redesenhados. O código fora do recorte recebe somente correções mecânicas de lint/formatação. Testes adicionais validam comportamentos existentes em outros módulos.

Mantidos e documentados: `upsertIa` sem QueryRunner falha antes do fallback de transação; atualização manual sem `exitTime` pode limpar a saída; IA usa fallback por valor truthy e preserva o instante original de entrada; recuperação de senha por email permanece não implementada. A proteção do cron evita sobreposição apenas na mesma instância, sem lock distribuído. Não há promessa de resolver esses problemas nesta refatoração. O audit registra 75 vulnerabilidades (13 altas), sem upgrades amplos de runtime.

Ferramentas e uso de IA: [bloco 03](03-ferramentas.md). A aprovação de escopo e as revisões/autorias humanas exigidas estão [pendentes](05-repositorio.md).

## Evidências

- [Baseline](../reports/baseline.json), [caracterização prévia](../reports/characterization.json), [métricas finais](../reports/final.json) e [enunciado](../task.md).
- [Seis PRs reais](../reports/delivery.json), [testes com nomes dos cenários](../reports/test-results.json) e [comparação HTTP/PostgreSQL](../reports/demo-comparison.json).
- `git diff original...refactor/clean-code-project -- src/modules/plate-reading src/modules/parking-record/domain/services src/modules/vehicle/domain/services`.
