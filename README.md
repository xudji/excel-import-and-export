# Excel 导入导出功能实现

### 安装运行

```javascript
node.js版本 16.19.1
yarn install
yarn serve
```
### 主要依赖插件

```javascript
npm install xlsx file-saver -S
npm install script-loader -S -D
```

### Excel 导入展示表格

#### 使用方法

1. 点击上传， 选择Excel 文件，文件会传递给子组件处理，回调中拿到处理好的数据和表头，在父组件通过elemnt-ui的表格遍历数据展示出表格。
2. 在页面的模板部分，有一个 `upload-excel-component` 组件用于处理文件上传。该组件接受两个属性：`on-success` 和 `before-upload`。`on-success` 是一个回调函数，会在成功处理 Excel 文件后被触发，`before-upload` 则是一个方法，在上传之前用于进行一些验证或处理。
3. 接下来，使用了 `el-table` 组件来展示表格数据。`tableData` 和 `tableHeader` 作为数据属性用于存储从 Excel 文件中提取出的数据和表头信息。
4. 在脚本部分，定义了 `beforeUpload` 和 `handleSuccess` 两个方法。`beforeUpload` 方法用于在上传之前进行文件大小的验证，确保文件大小不超过 1MB。如果文件大小符合要求，返回 true，否则会弹出一个警告消息，并返回 false，取消上传。
5. `handleSuccess` 方法用于在成功处理 Excel 文件后更新表格数据。它接收一个对象作为参数，其中包含了 `results` 和 `header`，分别代表从文件中提取出的数据和表头信息。通过将这些数据赋值给 `tableData` 和 `tableHeader` 变量，实现了将 Excel 数据转换为表格数据并显示在页面上。
6. 综上所述，这段代码实现了一个上传 Excel 文件并将其内容转换为表格形式展示的功能。用户选择并上传 Excel 文件后，文件会被解析并提取出数据和表头信息，然后通过表格组件进行显示。

#### 实现逻辑

1. **文件拖拽上传：**通过handleDrop和handleDragover方法，实现了将Excel文件通过拖拽方式上传的功能。在handleDrop方法中，检查文件数量、文件类型，并调用upload方法进行文件上传。

2. **文件选择上传：**通过handleClick和handleUpload方法，实现了通过点击按钮选择文件上传的功能。handleClick方法用于获取选择的文件并调用upload方法进行文件上传，而handleUpload方法用于触发文件选择窗口。

3. **文件读取和解析：**`readerData` 方法使用 `FileReader` 对象读取文件内容，当读取完成后，将文件内容解析成 Excel 数据。首先将文件内容转换为二进制数组 `ArrayBuffer`，然后使用 `XLSX.read` 方法将数组解析成 Workbook 对象。接着获取到第一个 Sheet 的名称和 Sheet 对象，使用 `getHeaderRow` 方法获取 Excel 表格的表头数据，并使用 `XLSX.utils.sheet_to_json` 方法将表格数据转换成 JSON 数据。最后调用 `generateData` 方法将表头数据和结果数据保存到 `excelData` 对象中，并调用 `onSuccess` 回调函数（如果存在）将 Excel 数据传递给外部组件。

   `getHeaderRow` 方法根据 Sheet 对象的范围**解析表头数据**，遍历每一列，在第一行中查找对应的单元格，并将其格式化为文本形式的表头数据，保存到 `headers` 数组中。

   **判断文件类型：**`isExcel` 方法用来判断文件是否是 Excel 文件，通过正则表达式匹配文件名后缀名是否为 `.xlsx`、`.xls` 或 `.csv`。

4. 数据处理和回调：通过generateData方法，将表头和数据保存在excelData对象中，并调用onSuccess回调函数将excelData传递给父组件。另外，beforeUpload回调函数可用于在上传前对文件进行处理，例如文件格式校验等。

实现了文件拖拽上传和文件选择上传的功能，并使用 `FileReader` 和 `xlsx` 库实现了文件读取和解析功能，可以方便地处理上传的 Excel 文件，并将解析后的数据传递给父组件进行进一步处理或展示。

**拖拽上传原理**

1. 当用户将文件拖动到页面中时，浏览器会触发 `dragover` 和 `dragenter` 事件。
2. 在 `handleDragover` 方法中，我们首先调用 `e.stopPropagation()` 和 `e.preventDefault()` 来阻止默认的拖拽行为，比如禁止浏览器打开文件。然后设置 `e.dataTransfer.dropEffect` 属性为 `'copy'`，以指示在目标区域释放文件时将执行复制操作。
3. 当用户在页面中释放鼠标按钮时，浏览器会触发 `drop` 事件。
4. 在 `handleDrop` 方法中，我们再次调用 `e.stopPropagation()` 和 `e.preventDefault()` 来阻止默认的拖拽行为。如果 `loading` 标志为 `true`，表示当前正在上传文件，我们直接返回，不做任何处理。
5. 我们通过 `e.dataTransfer.files` 属性获取用户拖拽的文件列表。如果文件数量不是 1，即不满足只支持上传一个文件的要求，就显示错误提示信息并返回。
6. 如果文件数量满足要求，我们只使用列表中的第一个文件 `files[0]` 进行处理。
7. 使用 `this.isExcel(rawFile)` 方法判断文件类型是否为 Excel 文件。如果不是，显示错误提示信息并返回 false。
8. 如果文件类型为 Excel 文件，我们调用 `this.upload(rawFile)` 方法进行文件上传处理，之后就是表格数据处理到返回数据的步骤。

总结起来，拖拽的原理是通过监听 `dragover` 事件来设置拖拽效果，并在 `drop` 事件中获取用户拖拽的文件进行处理。在处理过程中，需要取消默认的拖拽行为，并根据业务需求进行相应的处理操作。

### Excel 导出下载

#### 使用方法

1. 在`data`中定义了组件的数据属性，包括`list`（表格数据数组）、`filename`（导出文件名）、`autoWidth`（是否自动调整列宽）、`bookType`（Excel文件类型）。
2. `fetchData`方法通过发送HTTP GET请求获取表格数据，然后将数据赋值给`list`。
3. `handleDownload`方法用于处理**导出Excel操作**。首先通过动态导入`Export2Excel`库，然后定义了表头(`tHeader`)和字段名(`filterVal`)，以及要导出的数据(`list`)。调用`formatJson`函数，将数据数组按照之前定义的数据字段数组(filterVal)进行格式化,其中日期字段(`date`)通过调用`parseTime`工具函数进行格式化，使其符合`export_json_to_excel`函数的要求。
4. 在`excel.export_json_to_excel`函数中，传入了导出Excel文件所需的参数：表头(`header`)、格式化后的数据(`data`)、文件名(`filename`)、是否自动调整列宽(`autoWidth`)和导出文件的类型(`bookType`)。
5. 在`created`生命周期钩子中调用`fetchData`方法，实现组件初始化时获取表格数据。

总的来说，该组件通过发送请求获取数据，并提供导出Excel的功能，其中使用到了一些辅助方法来格式化日期和处理数据。

#### 实现逻辑

通过Export2Excel.js工具函数  里面封装的方法 和 引入外部`file-saver`库和`XLSX`库

```javascript
import { saveAs } from 'file-saver'
import XLSX from 'xlsx'
```

`saveAs` 函数   `saveAs(blob, filename);`通常用于在浏览器中实现文件下载功能。它可以将文件的二进制数据保存到客户端设备上

`xlsx`模块是一个流行的 JavaScript 库，用于处理和操作 Excel 文件。它提供了一系列的功能，包括读取、写入、编辑、解析和生成 Excel 文件

**`export_json_to_excel` 函数的实现逻辑**

1. 首先，函数接受一个参数 `jsonData`，表示要导出的 JSON 数据。这个数据应该是一个数组，每个元素都是一个对象，表示 Excel 表格中的一行数据。
2. 接下来，函数创建一个新的 Workbook 对象，用于存储 Excel 文档的内容。Workbook 是整个 Excel 文档的顶级对象，它包含一个或多个 Sheet（工作表）。
3. 然后，创建一个名为 "SheetJS" 的工作表，并将其添加到 Workbook 对象中。工作表是 Excel 文档中的一页，用于存储数据。
4. 在这一步，我们需要将 JSON 数据转换为工作表数据。`sheet_from_array_of_arrays` 函数用于将一个二维数组表示的数据转换为工作表对象。
5. 最后，将 Workbook 对象转换为二进制数据，并保存为 Excel 文件。

这就是 `export_json_to_excel` 函数的详细实现逻辑。它会将传入的 JSON 数据转换为 Excel 文件，并将其保存到客户端设备中。

**`export_table_to_excel` 函数的实现逻辑**

1. `generateArray` 函数根据表格的结构和内容生成一个二维数组，代表表格的数据。其中，如果单元格中的内容可以转换为数字，则将其转换为数字类型。
2. `datenum` 函数用于将日期格式转换为Excel中的日期数值。
3. `sheet_from_array_of_arrays` 函数根据数据数组生成一个工作表对象。该函数还会确定工作表的范围。
4. `Workbook` 构造函数用于创建一个工作簿对象。
5. `s2ab` 函数用于将字符串转换为 ArrayBuffer 对象。
6. `export_table_to_excel` 函数是最主要的导出函数。它首先获取指定 ID 的表格元素，然后调用 `generateArray` 函数将表格数据生成为二维数组。接下来，创建工作簿和工作表对象，并将数据填充到工作表中。最后，使用 `XLSX.write` 方法将工作簿对象转换为二进制数据，并通过 `saveAs` 函数将数据保存为 Excel 文件。

总结起来，`export_table_to_excel` 函数的核心逻辑是将 HTML 表格转换为数据数组，然后将数据写入到 Excel 文件中并保存。