<template>
  <div class="app-container">
    <div>
      <FilenameOption v-model="filename" />
      <AutoWidthOption v-model="autoWidth" />
      <BookTypeOption v-model="bookType" />
      <el-button
      
        style="margin: 0 0 20px 20px"
        type="primary"
        icon="el-icon-document"
        @click="handleDownload"
      >
        Export Excel
      </el-button>
     
    </div>

    <el-table
      :data="list"
      element-loading-text="Loading..."
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="Id" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="Author" width="110" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.author }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Readings" width="115" align="center">
        <template slot-scope="scope">
          {{ scope.row.readings }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Date" width="220">
        <template slot-scope="scope">
          <span>{{ scope.row.date | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";
import { parseTime } from '@/utils'

// options components
import FilenameOption from "./components/FilenameOption";
import AutoWidthOption from "./components/AutoWidthOption";
import BookTypeOption from "./components/BookTypeOption";

export default {
  name: "ExportExcel",
  components: { FilenameOption, AutoWidthOption, BookTypeOption },
  data() {
    return {
      list: null,
   
      filename: "",
      autoWidth: true,
      bookType: "xlsx",
    };
  },
  filters: {
    parseTime(time, cFormat) {
      if (arguments.length === 0 || !time) {
        return null;
      }
      const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
      let date;
      if (typeof time === "object") {
        date = time;
      } else {
        if (typeof time === "string") {
          if (/^[0-9]+$/.test(time)) {
            // support "1548221490638"
            time = parseInt(time);
          } else {
            // support safari
            // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
            time = time.replace(new RegExp(/-/gm), "/");
          }
        }

        if (typeof time === "number" && time.toString().length === 10) {
          time = time * 1000;
        }
        date = new Date(time);
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay(),
      };
      const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key];
        // Note: getDay() returns 0 on Sunday
        if (key === "a") {
          return ["日", "一", "二", "三", "四", "五", "六"][value];
        }
        return value.toString().padStart(2, "0");
      });
      return time_str;
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      axios
        .get("/api/tableData")
        .then((response) => {
          this.list = response.data.data;
          console.log(this.list);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    handleDownload() {
     
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = ["Id", "Title", "Author", "Readings", "Date"];
        const filterVal = ["id", "title", "author", "readings", "date"];
        const list = this.list;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType,
        });
      
      });
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j == "date") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
  },
};
</script>

<style>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>
