import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Table, Space, Input } from "antd";
const Search = Input.Search;

const Product = () => {
  const [state, setstate] = useState([]);
  const [count, setcount] = useState(1);
  const [search, setsearch] = useState("");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    sorter: {
      field: "id",
      order: "ascend",
    },
  });
  const [loading, setloading] = useState(true);
  useEffect(() => {
    getData();
  }, [JSON.stringify(tableParams), search]);

  const onSearch = (value) => {
    setsearch(value);
  };

  const getData = async () => {
    let data = {
      skip:
        (tableParams.pagination.current - 1) *
          tableParams.pagination.pageSize || 0,
      take: tableParams.pagination.pageSize || 10,
      keyword: search,
      sortField: tableParams.sorter.field || "id",
      sortOrder: tableParams.sorter.order || "ascend",
    };
    console.log(data);
    await Axios.post("http://localhost:3001/product/search", data).then(
      (res) => {
        console.log(res.data);
        setloading(false);
        setcount(res.data.count);
        setstate(res.data.data);
      }
    );
  };

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      width: 150,
      sorter: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 150,
      filterSearch: true,
    },
    {
      title: "Description",
      dataIndex: "desc",
      width: 150,
    },
    {
      title: "Average Rating",
      dataIndex: "avg_rating",
      width: 150,
      sorter: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      width: 150,
      sorter: true,
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      sorter,
    });
  };

  return (
    <div>
      {loading ? (
        "Loading"
      ) : (
        <div>
          <Search
            placeholder="Search Product By Name"
            allowClear
            onSearch={onSearch}
            onChange={(e) => {
              onSearch(e.target.value);
            }}
          />
          <Table
            columns={columns}
            dataSource={state}
            pagination={{ defaultPageSize: 10, total: count }}
            //   scroll={{ y: 240 }}
            onChange={handleTableChange}
            rowKey="id"
          />
        </div>
      )}
    </div>
  );
};

export default Product;
