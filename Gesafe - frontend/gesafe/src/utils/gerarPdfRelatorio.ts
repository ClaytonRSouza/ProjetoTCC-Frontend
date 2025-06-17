import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

interface RelatorioItem {
  propriedade: string;
  produto: string;
  embalagem?: string;
  quantidade: number;
  validade?: string;
  tipo?: string;
  justificativa?: string;
  valorUnitario?: string;
  valorTotal?: string;
}

export async function gerarPdfRelatorio(titulo: string, dados: RelatorioItem[]) {
  // Agrupar por propriedade
  const agrupado = dados.reduce((acc, item) => {
    if (!acc[item.propriedade]) acc[item.propriedade] = [];
    acc[item.propriedade].push(item);
    return acc;
  }, {} as Record<string, RelatorioItem[]>);

  const html = `
  <html>
  <head>
    <style>
      body { font-family: sans-serif; padding: 24px; }
      h1 { font-size: 24px; margin-bottom: 16px; }
      h2 { margin-top: 24px; margin-bottom: 8px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
      th, td { border: 1px solid #ccc; padding: 6px; text-align: left; font-size: 13px; }
      th { background-color: #f0f0f0; }
    </style>
  </head>
  <body>
    <h1>${titulo}</h1>

    ${Object.entries(agrupado).map(([propriedade, itens]) => `
      <h2>${propriedade}</h2>
      <table>
        <tr>
          <th>Produto</th>
          <th>Embalagem</th>
          <th>Quantidade</th>
          ${itens.some(i => i.validade) ? '<th>Validade</th>' : ''}
          ${itens.some(i => i.tipo) ? '<th>Tipo</th>' : ''}
          ${itens.some(i => i.justificativa) ? '<th>Justificativa</th>' : ''}
          ${itens.some(i => i.valorUnitario) ? '<th>Vlr Unit</th>' : ''}
          ${itens.some(i => i.valorTotal) ? '<th>Vlr Total</th>' : ''}
        </tr>
        ${itens.map(i => `
          <tr>
            <td>${i.produto}</td>
            <td>${i.embalagem || ''}</td>
            <td>${i.quantidade}</td>
            ${i.validade ? `<td>${i.validade}</td>` : ''}
            ${i.tipo ? `<td>${i.tipo}</td>` : ''}
            ${i.justificativa ? `<td>${i.justificativa}</td>` : ''}
            ${i.valorUnitario ? `<td>R$ ${i.valorUnitario}</td>` : ''}
            ${i.valorTotal ? `<td>R$ ${i.valorTotal}</td>` : ''}
          </tr>
        `).join('')}
      </table>
    `).join('')}
  </body>
  </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri);
}
