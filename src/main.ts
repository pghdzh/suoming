import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { reveal } from "./directives/reveal";

/* 样式顺序：reset 先归零 → Element Plus 局部组件样式 → theme 建立全站令牌与质感 */
import "./assets/reset.css";
import "element-plus/es/components/message/style/css";
import "element-plus/es/components/message-box/style/css";
import "./styles/theme.scss";

const app = createApp(App);

app.use(router);
app.directive("reveal", reveal);

app.config.errorHandler = (err, _instance, info) => {
  console.error("[锁暝] 运行时异常：", info, err);
};

app.mount("#app");
