import Mock from 'mockjs';



Mock.mock('/api/tableData', 'get', {
  'data|10': [
    {
      'id|+1': 1,
      title: '@ctitle(5, 10)',
      author: '@cname',
      readings: '@integer(10, 100)',
      date: () => new Date(Mock.Random.datetime()).getTime(),
    },
  ],
});