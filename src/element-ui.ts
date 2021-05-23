import Vue from 'vue';
import {
  Form,
  FormItem,
  Input,
  Button,
  Select,
  Option,
  Icon,
  Tooltip,
  Menu,
  MenuItem,
  Avatar,
  Dialog,
  Drawer,
  Message,
  Notification,
  Steps,
  Step,
  Loading,
  MessageBox,
} from 'element-ui';

export function useElementComponent() {
  Vue.prototype.$message = Message;
  Vue.prototype.$notify = Notification;
  Vue.prototype.$alert = MessageBox.alert;
  Vue.prototype.$confirm = MessageBox.confirm;
  Vue.prototype.$prompt = MessageBox.prompt;
  Vue.use(Form);
  Vue.use(FormItem);
  Vue.use(Input);
  Vue.use(Button);
  Vue.use(Select);
  Vue.use(Option);
  Vue.use(Icon);
  Vue.use(Tooltip);
  Vue.use(Menu);
  Vue.use(MenuItem);
  Vue.use(Avatar);
  Vue.use(Dialog);
  Vue.use(Drawer);
  Vue.use(Steps);
  Vue.use(Step);
  Vue.use(Loading);
};