<!--
 * @Description:
 * @Version:
 * @Author: ji.yaning
 * @Date: 2024-04-10 16:05:30
 * @LastEditors: ji.yaning
 * @LastEditTime: 2024-04-11 09:35:10
-->
<template>
  <div>
    <div>绘制 Tutorial 案例</div>
    <!-- 创建一个用于容纳 G6 绘制的图的容器，通常为div标签。G6 在绘制时会在该容器下追加canvas标签，然后将图绘制在其中。 -->
    <div id="mountNode"></div>
  </div>
</template>

<script>
// 引入 G6
import G6 from '@antv/g6';

export default {
  name: 'G6Topology',
  data () {
    return {
      initData: {
        // 点集
        nodes: [
          {
            id: 'node1', // 节点的唯一标识
            x: 100, // 节点横坐标
            y: 200, // 节点纵坐标
            label: '起始点', // 节点文本
          },
          {
            id: 'node2',
            x: 300,
            y: 200,
            label: '目标点',
          },
        ],
        // 边集
        edges: [
          // 表示一条从 node1 节点连接到 node2 节点的边
          {
            source: 'node1', // 起始点 id
            target: 'node2', // 目标点 id
            label: '我是连线', // 边的文本
          },
        ],
      },
      graph: null
    };
  },
  created () {
    this.getData().then(() => {
      this.initGraph()
    })
  },
  methods: {
    async getData () {
      const response = await fetch(
        'https://gw.alipayobjects.com/os/basement_prod/6cae02ab-4c29-44b2-b1fd-4005688febcb.json',
      );
      const remoteData = await response.json();
      // console.log("getData ~ remoteData:", remoteData)

      remoteData.nodes.forEach((node) => {
        if (!node.style) {
          node.style = {};
        }
        switch (
        node.class // 根据节点数据中的 class 属性配置图形
        ) {
          case 'c0': {
            node.type = 'circle'; // class = 'c0' 时节点图形为 circle   在默认圆形的情况下，G6 将仍然读取全局配置的 size 属性
            break;
          }
          case 'c1': {
            node.type = 'rect'; // class = 'c1' 时节点图形为 rect
            node.size = [35, 20]; // class = 'c1' 时节点大小   在矩形和椭圆的情况下，size 是一个数组
            break;
          }
          case 'c2': {
            node.type = 'ellipse'; // class = 'c2' 时节点图形为 ellipse
            node.size = [35, 20]; // class = 'c2' 时节点大小
            break;
          }
        }
      });

      remoteData.edges.forEach((edge) => {
        if (!edge.style) {
          edge.style = {};
        }
        edge.style.lineWidth = edge.weight; // 边的粗细映射边数据中的 weight 属性数值
        // 动态配置属性会覆盖全局配置属性，配置了 style.lineWidth，导致覆盖了全局的 style 对象。解决办法是将被覆盖的边的样式都移到动态配置里面来
        edge.style.opacity = 0.3;
        edge.style.stroke = '#dc402b';
      });

      this.initData = remoteData
    },
    initGraph () {
      // 图实例化时，至少需要为图设置容器、宽、高
      this.graph = new G6.Graph({
        container: 'mountNode', // 指定挂载容器
        width: 800, // 图的宽度
        height: 600, // 图的高度
        // fitView: true, // 设置是否将图适配到画布中
        // fitViewPadding: [20, 40, 50, 20], // 画布上四周的留白宽度
        animate: true, // 是否启用图的动画
        modes: {  // 图上行为模式的集合
          default: ['drag-node', 'drag-canvas', 'zoom-canvas'], // 允许拖拽节点、拖拽画布、放缩画布  默认模式能拖拽画布
          edit: [], // 编辑模式不允许拖拽画布
        },
        defaultNode: {  // 节点默认的属性，包括节点的一般属性和样式属性（style）。
          color: '#1078df',
          id: 'node0',          // 元素的 id
          type: 'circle',       // 元素的图形
          size: 40,             // 元素的大小
          label: 'node0',       // 标签文字
          visible: true,        // 控制初次渲染显示与隐藏，若为 false，代表隐藏。默认不隐藏
          // 节点上的标签文本配置
          labelCfg: {           // 标签配置属性
            positions: 'center',// 标签的属性，标签在元素中的位置
            // 节点上的标签文本样式配置
            style: {            // 包裹标签样式属性的字段 style 与标签其他属性在数据结构上并行
              fontSize: 12,      // 标签的样式属性，文字字体大小
              fill: '#f7f7f7', // 节点标签文字颜色
            }
          },
          // 节点样式配置
          style: {              // 包裹样式属性的字段 style 与其他属性在数据结构上并行
            fill: '#CCC',       // 样式属性，元素的填充色
            stroke: '#888',     // 样式属性，元素的描边色
            lineWidth: 1,       // 样式属性，节点描边粗细
          }
        },
        defaultEdge: { // 边默认的属性，包括边的一般属性和样式属性（style）
          type: 'polyline',
          color: '#000',
          // 边样式配置
          // 去掉全局配置的 style
          // style: {
          //   opacity: 0.3,  // 边的透明度
          //   stroke: '#dc402b', // 边的颜色
          // },
          // 边上的标签文本配置
          labelCfg: {
            autoRotate: true, // 边上的标签文本根据边的方向旋转
            style: {
              fontSize: 20,
              fill: 'blue'
            },
          },
        },
        nodeStateStyles: {  // 节点在除默认状态外，其他状态下的样式属性（style）。例如鼠标放置（hover）、选中（select）等状态。
          hover: {
            color: 'red'
          },
          select: {
            color: 'blue'
          }
        },
        edgeStateStyles: { // 边在除默认状态外，其他状态下的样式属性（style）。例如鼠标放置（hover）、选中（select）等状态
          hover: {

          },
          select: {

          }
        },
        layout: {  // 布局将在调用  graph.render() 时执行计算
          // Object，可选，布局的方法及其配置项，默认为 random 布局。
          type: 'force', // 指定为力导向布局
          preventOverlap: true, // 防止节点重叠
          // nodeSize: 30        // 节点大小，用于算法中防止节点重叠时的碰撞检测。由于已经在元素配置中设置了每个节点的 size 属性，则不需要在此设置 nodeSize。
          linkDistance: 100, // 指定边距离为100
        },
        // 节点不同状态下的样式集合
        nodeStateStyles: {
          hover: {  // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
            fill: 'lightsteelblue',
          },
          click: {  // 鼠标点击节点，即 click 状态为 true 时的样式
            stroke: '#000',
            lineWidth: 3,
          },
        },
        // 边不同状态下的样式集合
        edgeStateStyles: {
          click: {   // 鼠标点击边，即 click 状态为 true 时的样式
            stroke: 'steelblue',
          },
        },
      });

      // 数据的加载和图的渲染是两个步骤，可以分开进行
      this.graph.data(this.initData); // 加载数据
      this.graph.render(); // 渲染

      // 鼠标进入节点
      this.graph.on('node:mouseenter', (e) => {
        const nodeItem = e.item; // 获取鼠标进入的节点元素对象
        this.graph.setItemState(nodeItem, 'hover', true); // 设置当前节点的 hover 状态为 true
      });

      // 鼠标离开节点
      this.graph.on('node:mouseleave', (e) => {
        const nodeItem = e.item; // 获取鼠标离开的节点元素对象
        this.graph.setItemState(nodeItem, 'hover', false); // 设置当前节点的 hover 状态为 false
      });

      // 点击节点
      this.graph.on('node:click', (e) => {
        // 先将所有当前是 click 状态的节点置为非 click 状态
        const clickNodes = this.graph.findAllByState('node', 'click');
        clickNodes.forEach((cn) => {
          this.graph.setItemState(cn, 'click', false);
        });
        const nodeItem = e.item; // 获取被点击的节点元素对象
        this.graph.setItemState(nodeItem, 'click', true); // 设置当前节点的 click 状态为 true
      });

      // 点击边
      this.graph.on('edge:click', (e) => {
        // 先将所有当前是 click 状态的边置为非 click 状态
        const clickEdges = this.graph.findAllByState('edge', 'click');
        clickEdges.forEach((ce) => {
          this.graph.setItemState(ce, 'click', false);
        });
        const edgeItem = e.item; // 获取被点击的边元素对象
        this.graph.setItemState(edgeItem, 'click', true); // 设置当前边的 click 状态为 true
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
