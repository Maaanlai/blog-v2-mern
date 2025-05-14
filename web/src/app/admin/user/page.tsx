"use client";

import React from "react";
import { DataTable } from "../../../../components/data-table";
import { Button, Flex, Loader } from "@mantine/core";

type SortableFields = Pick<
  {
    fullName: string;
    rating: number;
    createdAt: Date;
    email: string;
    phone: string;
    status: string;
    address: string;
    city: string;
    country: string;
  },
  "fullName" | "rating" | "createdAt"
>;

function CustomerPage() {
  const metrics: any = {
    total: 100,
    active: 50,
    banned: 30,
    archived: 20,
  };

  const { tabs, filters, sort } = DataTable.useDataTable<SortableFields>({
    sortConfig: {
      direction: "asc",
      column: "fullName",
    },
    tabsConfig: {
      tabs: [
        {
          value: "*",
          label: "All",
          counter: metrics?.total,
          rightSection: <Loader size="xs" />,
        },
        {
          value: "active",
          label: "Active",
          color: "teal",
          counter: metrics?.active,
          rightSection: <Loader size="xs" color="teal" />,
        },
        {
          value: "banned",
          label: "Banned",
          color: "orange",
          counter: metrics?.banned,
          rightSection: <Loader size="xs" color="teal" />,
        },
        {
          value: "archived",
          label: "Archived",
          color: "red",
          counter: metrics?.archived,
          rightSection: <Loader size="xs" color="teal" />,
        },
      ],
    },
  });

  return (
    <DataTable.Container w={"100%"}>
      <DataTable.Title
        title="Customers"
        description="List of all customers"
        actions={<Button>Test</Button>}
      />
      <DataTable.Filters filters={filters.filters} onClear={filters.clear} />
      <DataTable.Content>
        <DataTable.Table
          minHeight={240}
          noRecordsText={DataTable.noRecordsText("customer")}
          recordsPerPageLabel={DataTable.recordsPerPageLabel("customers")}
          paginationText={DataTable.paginationText("customers")}
          page={1}
          records={[]}
          fetching={false}
          onPageChange={() => {}}
          recordsPerPage={10}
          totalRecords={100}
          onRecordsPerPageChange={() => {}}
          recordsPerPageOptions={[5, 15, 30]}
          sortStatus={sort.status}
          onSortStatusChange={sort.change}
          columns={[]}
        />
      </DataTable.Content>
    </DataTable.Container>
  );
}

export default CustomerPage;
