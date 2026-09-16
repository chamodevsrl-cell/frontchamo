import { getClients } from "@/services/adminApi";

function soles(value: number) {
  return `S/ ${value.toLocaleString("es-PE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default async function AdminClientesPage() {
  const clients = await getClients();

  return (
    <div className="space-y-4">
      <p className="text-sm text-brand-dark/65">
        {clients.length} cliente{clients.length === 1 ? "" : "s"} derivados de
        pedidos · mock <code>getClients()</code>
      </p>
      <div className="overflow-x-auto rounded-2xl border border-brand-dark/10 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#0B3554] text-xs font-semibold tracking-wide text-white uppercase">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Pedidos</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-brand-dark/55">
                  No hay clientes en el mock de pedidos.
                </td>
              </tr>
            ) : (
              clients.map((client, index) => (
                <tr
                  key={client.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-[#eef6fc]"}
                >
                  <td className="px-4 py-3 font-semibold">{client.name}</td>
                  <td className="px-4 py-3">{client.phone}</td>
                  <td className="px-4 py-3">{client.email}</td>
                  <td className="px-4 py-3">{client.ordersCount}</td>
                  <td className="px-4 py-3 font-display font-bold">
                    {soles(client.totalSpent)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
