import React, { useMemo } from "react";
import { useTable, useSortBy, useFilters, Column } from "react-table";
import moment from "moment";
import Link from "next/link";
import { DataItem } from "@/types/DataItem";

export function Table({ data }: Readonly<{ data: DataItem[] }>) {
  if (!data) return null;

  // Converter datas
  const convertedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      DATAULTIMAMENSAGEM: moment(
        item.DATAULTIMAMENSAGEM,
        "DD/MM/YYYY HH:mm"
      ).toDate(),
      DATA: moment(item.DATA, "DD/MM/YYYY HH:mm").toDate(),
    }));
  }, [data]);

  // Encontrar última interação por número
  const followupData = useMemo(() => {
    const grouped = convertedData.reduce<Record<string, DataItem>>(
      (acc, item) => {
        const key = item.NUMERO;
        if (!acc[key]) {
          acc[key] = {
            ...item,
            DATAULTIMAMENSAGEM: moment(item.DATAULTIMAMENSAGEM).format(
              "DD/MM/YYYY HH:mm"
            ),
            DATA: moment(item.DATA).format("DD/MM/YYYY HH:mm"),
          };
        } else {
          acc[key].DATAULTIMAMENSAGEM = moment
            .max(
              moment(acc[key].DATAULTIMAMENSAGEM, "DD/MM/YYYY HH:mm"),
              moment(item.DATAULTIMAMENSAGEM, "DD/MM/YYYY HH:mm")
            )
            .format("DD/MM/YYYY HH:mm");
          acc[key].DATA = moment
            .min(
              moment(acc[key].DATA, "DD/MM/YYYY HH:mm"),
              moment(item.DATA, "DD/MM/YYYY HH:mm")
            )
            .format("DD/MM/YYYY HH:mm");
        }
        return acc;
      },
      {}
    );

    const data_mais_recente = moment.max(
      ...convertedData.map((item) =>
        moment(item.DATAULTIMAMENSAGEM, "DD/MM/YYYY HH:mm")
      )
    );

    return Object.values(grouped).map((item) => ({
      ...item,
      DIAS_SEM_CONTATO: data_mais_recente.diff(
        moment(item.DATAULTIMAMENSAGEM, "DD/MM/YYYY HH:mm"),
        "days"
      ),
      DIAS_TOTAL: data_mais_recente.diff(
        moment(item.DATA, "DD/MM/YYYY HH:mm"),
        "days"
      ),
      DATAULTIMAMENSAGEM: item.DATAULTIMAMENSAGEM,
      DATA: item.DATA,
    }));
  }, [convertedData]);

  const columns = useMemo<Column<DataItem>[]>(
    () => [
      { Header: "Nome", accessor: "NOME" },
      {
        Header: "Número",
        accessor: "NUMERO",
        Cell: ({ value }) => (
          <Link
            href={`https://wa.me/${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {value}
          </Link>
        ),
      },
      { Header: "Status", accessor: "STATUS" },
      { Header: "Data Início", accessor: "DATA" },
      { Header: "Último Contato", accessor: "DATAULTIMAMENSAGEM" },
      { Header: "Dias Sem Contato", accessor: "DIAS_SEM_CONTATO" },
      { Header: "Dias Total", accessor: "DIAS_TOTAL" },
    ],
    []
  );

  const tableInstance = useTable(
    { columns, data: followupData },
    useFilters,
    useSortBy
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Follow-up de Clientes</h3>
      <table
        {...getTableProps()}
        className="min-w-full bg-white border border-gray-300 rounded-md shadow-sm"
      >
        <thead className="bg-gray-50">
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="bg-gray-200"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((column: any) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="p-2 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  key={column.id}
                >
                  {column.render("Header")}
                  <span>
                    {(() => {
                      if (!column.isSorted) return "";
                      return column.isSortedDesc ? " 🔽" : " 🔼";
                    })()}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            const { DIAS_SEM_CONTATO } = row.original;
            const isLongTimeNoContact = (DIAS_SEM_CONTATO ?? 0) > 3;
            return (
              <tr
                {...row.getRowProps()}
                className={`hover:bg-gray-100 ${
                  isLongTimeNoContact ? "bg-red-100 text-red-700" : ""
                }`}
                key={row.id}
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="p-2 border-b border-gray-300"
                    key={cell.column.id}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
