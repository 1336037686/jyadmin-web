<template>
  <el-dialog
    :title="title"
    :visible.sync="tmpVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :show-close="false"
    width="40%"
  >
    <div>

      <el-form ref="form" :rules="rules" size="mini" :model="form" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="菜单类型：" prop="type">
              <el-radio-group v-model="form.type" :disabled="type === 'update'">
                <el-radio-button :label="0">目录</el-radio-button>
                <el-radio-button :label="1">菜单</el-radio-button>
                <el-radio-button :label="2">按钮</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 目录 -->
        <el-row v-if="form.type === 0">
          <el-row>
            <el-col :span="12">
              <el-form-item label="菜单名称：" prop="name">
                <el-input v-model="form.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上级类目：" prop="parentId">
                <treeselect
                  v-model="form.parentId"
                  :options="menus"
                  :clearable="true"
                  placeholder=""
                  :normalizer="normalizer"
                  class="treeselect-main"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="目录编码：" prop="code">
                <el-input v-model="form.code" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="目录图标：" prop="icon">
<!--                <el-input v-model="form.icon" />-->
                <el-popover
                  placement="bottom"
                  width="450"
                  trigger="click"
                  @show="popoverShow"
                >
                <span slot="reference">
                  <el-input suffix-icon="data-icon" v-model="form.icon" placeholder="请输入">
                   <template slot="append">
                     <i :class="form.icon"/>
                   </template>
                  </el-input>
                </span>
                  <div class="icon_list">
                    <el-tabs v-model="activeName">
                      <el-tab-pane
                        v-for="(item, index) in iconList"
                        :key="item.label"
                        :name="'name'+ index"
                        :label="item.label"
                      >
                        <el-scrollbar >
                        <i
                          v-for="item in item.list"
                          :key="item"
                          :class="item"
                          @click="setIcon(item)"
                          style="font-size:20px"
                        ></i>
                        </el-scrollbar>
                      </el-tab-pane>
                    </el-tabs>
                  </div>
                </el-popover>

              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否显示：" prop="visiable">
                <el-radio-group v-model="form.visiable">
                  <el-radio-button :label="0">否</el-radio-button>
                  <el-radio-button :label="1">是</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否外链：" prop="link">
                <el-radio-group v-model="form.link">
                  <el-radio-button :label="0">否</el-radio-button>
                  <el-radio-button :label="1">是</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="路由地址：" prop="url">
                <el-input v-model="form.url" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态：" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio-button :label="0">禁用</el-radio-button>
                  <el-radio-button :label="1">启用</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="组件名称：" prop="component">
                <el-input v-model="form.component" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="组件地址：" prop="path">
                <el-input v-model="form.path" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="排序：" prop="sort">
                <el-input v-model="form.sort" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>

        <!-- 菜单 -->
        <el-row v-if="form.type === 1">
          <el-row>
            <el-col :span="12">
              <el-form-item label="菜单名称：" prop="name">
                <el-input v-model="form.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上级类目：" prop="parentId">
                <treeselect
                  v-model="form.parentId"
                  :options="menus"
                  :clearable="true"
                  placeholder=""
                  :normalizer="normalizer"
                  class="treeselect-main"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="菜单编码：" prop="code">
                <el-input v-model="form.code" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="菜单图标：" prop="icon">
<!--                <el-input v-model="form.icon" />-->
                <el-popover
                  placement="bottom"
                  width="450"
                  trigger="click"
                  @show="popoverShow"
                >
                <span slot="reference">
                  <el-input suffix-icon="data-icon" v-model="form.icon" placeholder="请输入">
                   <template slot="append">
                     <i :class="form.icon"/>
                   </template>
                  </el-input>
                </span>
                  <div class="icon_list">
                    <el-tabs v-model="activeName">
                      <el-tab-pane
                        v-for="(item, index) in iconList"
                        :key="item.label"
                        :name="'name'+ index"
                        :label="item.label"
                      >
                        <el-scrollbar >
                          <i
                            v-for="item in item.list"
                            :key="item"
                            :class="item"
                            @click="setIcon(item)"
                            style="font-size:20px"
                          ></i>
                        </el-scrollbar>
                      </el-tab-pane>
                    </el-tabs>
                  </div>
                </el-popover>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否缓存：" prop="cache">
                <el-radio-group v-model="form.cache">
                  <el-radio-button :label="0">否</el-radio-button>
                  <el-radio-button :label="1">是</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态：" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio-button :label="0">禁用</el-radio-button>
                  <el-radio-button :label="1">启用</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否显示：" prop="visiable">
                <el-radio-group v-model="form.visiable">
                  <el-radio-button :label="0">否</el-radio-button>
                  <el-radio-button :label="1">是</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否外链：" prop="link">
                <el-radio-group v-model="form.link">
                  <el-radio-button :label="0">否</el-radio-button>
                  <el-radio-button :label="1">是</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="路由地址：" prop="url">
                <el-input v-model="form.url" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序：" prop="sort">
                <el-input v-model="form.sort" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="组件名称：" prop="component">
                <el-input v-model="form.component" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="组件地址：" prop="path">
                <el-input v-model="form.path" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>

        <!-- 按钮 -->
        <el-row v-if="form.type === 2">
          <el-row>
            <el-col :span="12">
              <el-form-item label="按钮名称：" prop="name">
                <el-input v-model="form.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上级类目：" prop="parentId">
                <treeselect
                  v-model="form.parentId"
                  :options="menus"
                  :clearable="true"
                  placeholder=""
                  :normalizer="normalizer"
                  class="treeselect-main"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="权限编码：" prop="code">
                <el-input v-model="form.code" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态：" prop="status">
                <el-radio-group v-model="form.status">
                  <el-radio-button :label="0">禁用</el-radio-button>
                  <el-radio-button :label="1">启用</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="排序：" prop="sort">
                <el-input v-model="form.sort" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
        <el-form-item label="描述：" prop="description">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="resetForm('form')">取 消</el-button>
      <el-button type="primary" @click="handleSubmit('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import menuApi from '@/api/jy-permission-menu'
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'JyPermissionMenuForm',
  components: { Treeselect },
  props: {
    title: {
      type: String,
      default: 'Demo'
    },
    id: {
      type: String,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tmpVisible: this.visible,
      type: 'insert',
      form: {
        id: '',
        type: 0,
        name: '',
        code: '',
        parentId: null,
        icon: '',
        cache: 0,
        visiable: 1,
        link: 0,
        status: 1,
        url: '',
        sort: '',
        component: '',
        path: '',
        method: '',
        style: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      },
      menus: [],

      activeName: 'name0',
      iconList: [
        {
          label: '通用图标',
          id: 'first',
          list: [
            'el-icon-platform-eleme',
            'el-icon-eleme',
            'el-icon-delete-solid',
            'el-icon-delete',
            'el-icon-s-tools',
            'el-icon-setting',
            'el-icon-user-solid',
            'el-icon-user',
            'el-icon-phone',
            'el-icon-phone-outline',
            'el-icon-more',
            'el-icon-more-outline',
            'el-icon-star-on',
            'el-icon-star-off',
            'el-icon-s-goods',
            'el-icon-goods',
            'el-icon-warning',
            'el-icon-warning-outline',
            'el-icon-question',
            'el-icon-info',
            'el-icon-remove',
            'el-icon-circle-plus',
            'el-icon-success',
            'el-icon-error',
            'el-icon-zoom-in',
            'el-icon-zoom-out',
            'el-icon-remove-outline',
            'el-icon-circle-plus-outline',
            'el-icon-circle-check',
            'el-icon-circle-close',
            'el-icon-s-help',
            'el-icon-help',
            'el-icon-minus',
            'el-icon-plus',
            'el-icon-check',
            'el-icon-close',
            'el-icon-picture',
            'el-icon-picture-outline',
            'el-icon-picture-outline-round',
            'el-icon-upload',
            'el-icon-upload2',
            'el-icon-download',
            'el-icon-camera-solid',
            'el-icon-camera',
            'el-icon-video-camera-solid',
            'el-icon-video-camera',
            'el-icon-message-solid',
            'el-icon-bell',
            'el-icon-s-cooperation',
            'el-icon-s-order',
            'el-icon-s-platform',
            'el-icon-s-fold',
            'el-icon-s-unfold',
            'el-icon-s-operation',
            'el-icon-s-promotion',
            'el-icon-s-home',
            'el-icon-s-release',
            'el-icon-s-ticket',
            'el-icon-s-management',
            'el-icon-s-open',
            'el-icon-s-shop',
            'el-icon-s-marketing',
            'el-icon-s-flag',
            'el-icon-s-comment',
            'el-icon-s-finance',
            'el-icon-s-claim',
            'el-icon-s-custom',
            'el-icon-s-opportunity',
            'el-icon-s-data',
            'el-icon-s-check',
            'el-icon-s-grid',
            'el-icon-menu',
            'el-icon-share',
            'el-icon-d-caret',
            'el-icon-caret-left',
            'el-icon-caret-right',
            'el-icon-caret-bottom',
            'el-icon-caret-top',
            'el-icon-bottom-left',
            'el-icon-bottom-right',
            'el-icon-back',
            'el-icon-right',
            'el-icon-bottom',
            'el-icon-top',
            'el-icon-top-left',
            'el-icon-top-right',
            'el-icon-arrow-left',
            'el-icon-arrow-right',
            'el-icon-arrow-down',
            'el-icon-arrow-up',
            'el-icon-d-arrow-left',
            'el-icon-d-arrow-right',
            'el-icon-video-pause',
            'el-icon-video-play',
            'el-icon-refresh',
            'el-icon-refresh-right',
            'el-icon-refresh-left',
            'el-icon-finished',
            'el-icon-sort',
            'el-icon-sort-up',
            'el-icon-sort-down',
            'el-icon-rank',
            'el-icon-loading',
            'el-icon-view',
            'el-icon-c-scale-to-original',
            'el-icon-date',
            'el-icon-edit',
            'el-icon-edit-outline',
            'el-icon-folder',
            'el-icon-folder-opened',
            'el-icon-folder-add',
            'el-icon-folder-remove',
            'el-icon-folder-delete',
            'el-icon-folder-checked',
            'el-icon-tickets',
            'el-icon-document-remove',
            'el-icon-document-delete',
            'el-icon-document-copy',
            'el-icon-document-checked',
            'el-icon-document',
            'el-icon-document-add',
            'el-icon-printer',
            'el-icon-paperclip',
            'el-icon-takeaway-box',
            'el-icon-search',
            'el-icon-monitor',
            'el-icon-attract',
            'el-icon-mobile',
            'el-icon-scissors',
            'el-icon-umbrella',
            'el-icon-headset',
            'el-icon-brush',
            'el-icon-mouse',
            'el-icon-coordinate',
            'el-icon-magic-stick',
            'el-icon-reading',
            'el-icon-data-line',
            'el-icon-data-board',
            'el-icon-pie-chart',
            'el-icon-data-analysis',
            'el-icon-collection-tag',
            'el-icon-film',
            'el-icon-suitcase',
            'el-icon-suitcase-1',
            'el-icon-receiving',
            'el-icon-collection',
            'el-icon-files',
            'el-icon-notebook-1',
            'el-icon-notebook-2',
            'el-icon-toilet-paper',
            'el-icon-office-building',
            'el-icon-school',
            'el-icon-table-lamp',
            'el-icon-house',
            'el-icon-no-smoking',
            'el-icon-smoking',
            'el-icon-shopping-cart-full',
            'el-icon-shopping-cart-1',
            'el-icon-shopping-cart-2',
            'el-icon-shopping-bag-1',
            'el-icon-shopping-bag-2',
            'el-icon-sold-out',
            'el-icon-sell',
            'el-icon-present',
            'el-icon-box',
            'el-icon-bank-card',
            'el-icon-money',
            'el-icon-coin',
            'el-icon-wallet',
            'el-icon-discount',
            'el-icon-price-tag',
            'el-icon-news',
            'el-icon-guide',
            'el-icon-male',
            'el-icon-female',
            'el-icon-thumb',
            'el-icon-cpu',
            'el-icon-link',
            'el-icon-connection',
            'el-icon-open',
            'el-icon-turn-off',
            'el-icon-set-up',
            'el-icon-chat-round',
            'el-icon-chat-line-round',
            'el-icon-chat-square',
            'el-icon-chat-dot-round',
            'el-icon-chat-dot-square',
            'el-icon-chat-line-square',
            'el-icon-message',
            'el-icon-postcard',
            'el-icon-position',
            'el-icon-turn-off-microphone',
            'el-icon-microphone',
            'el-icon-close-notification',
            'el-icon-bangzhu',
            'el-icon-time',
            'el-icon-odometer',
            'el-icon-crop',
            'el-icon-aim',
            'el-icon-switch-button',
            'el-icon-full-screen',
            'el-icon-copy-document',
            'el-icon-mic',
            'el-icon-stopwatch',
            'el-icon-medal-1',
            'el-icon-medal',
            'el-icon-trophy',
            'el-icon-trophy-1',
            'el-icon-first-aid-kit',
            'el-icon-discover',
            'el-icon-place',
            'el-icon-location',
            'el-icon-location-outline',
            'el-icon-location-information',
            'el-icon-add-location',
            'el-icon-delete-location',
            'el-icon-map-location',
            'el-icon-alarm-clock',
            'el-icon-timer',
            'el-icon-watch-1',
            'el-icon-watch',
            'el-icon-lock',
            'el-icon-unlock',
            'el-icon-key',
            'el-icon-service',
            'el-icon-mobile-phone',
            'el-icon-bicycle',
            'el-icon-truck',
            'el-icon-ship',
            'el-icon-basketball',
            'el-icon-football',
            'el-icon-soccer',
            'el-icon-baseball',
            'el-icon-wind-power',
            'el-icon-light-rain',
            'el-icon-lightning',
            'el-icon-heavy-rain',
            'el-icon-sunrise',
            'el-icon-sunrise-1',
            'el-icon-sunset',
            'el-icon-sunny',
            'el-icon-cloudy',
            'el-icon-partly-cloudy',
            'el-icon-cloudy-and-sunny',
            'el-icon-moon',
            'el-icon-moon-night',
            'el-icon-dish',
            'el-icon-dish-1',
            'el-icon-food',
            'el-icon-chicken',
            'el-icon-fork-spoon',
            'el-icon-knife-fork',
            'el-icon-burger',
            'el-icon-tableware',
            'el-icon-sugar',
            'el-icon-dessert',
            'el-icon-ice-cream',
            'el-icon-hot-water',
            'el-icon-water-cup',
            'el-icon-coffee-cup',
            'el-icon-cold-drink',
            'el-icon-goblet',
            'el-icon-goblet-full',
            'el-icon-goblet-square',
            'el-icon-goblet-square-full',
            'el-icon-refrigerator',
            'el-icon-grape',
            'el-icon-watermelon',
            'el-icon-cherry',
            'el-icon-apple',
            'el-icon-pear',
            'el-icon-orange',
            'el-icon-coffee',
            'el-icon-ice-tea',
            'el-icon-ice-drink',
            'el-icon-milk-tea',
            'el-icon-potato-strips',
            'el-icon-lollipop',
            'el-icon-ice-cream-square',
            'el-icon-ice-cream-round'
          ]
        }
      ]
    }
  },
  watch: {
    visible(newVal) {
      this.tmpVisible = newVal
      if (newVal) {
        // 如果有ID则为修改操作
        if (this.id) {
          this.type = 'update'
          this.getById(this.id)
        } else {
        // 否则为新增操作
          this.type = 'insert'
        }
        // 获取菜单目录树
        this.getMenuTree()
      }
    },
    tmpVisible(newVal) {
      this.$emit('update:visible', newVal)
    },
    deep: true
  },
  methods: {
    /**
     * @description 图标弹窗框显示时触发
     * @author 饺子
     */
    popoverShow() {
      this.$nextTick(() => {
        this.activeName = 'name0'
      })
    },
    /**
     * @description 给icon绑定的点击事件
     * @author 饺子
     * @param { String } icon 图标
     */
    setIcon(icon) {
      this.$set(this.form, 'icon', icon)
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.type === 'insert') this.handleCreate()
          else this.handleUpdate()
        }
      })
    },
    handleCreate() {
      menuApi.add(this.form).then(response => {
        this.$notify.success({ title: '成功', message: '添加成功' })
        this.$parent.getList()
        this.tmpVisible = false

        this.resetForm('form')
        this.form.id = null
      }).catch(e => {
        this.$notify.error({ title: '失败', message: '添加失败' })
      })
    },
    handleUpdate() {
      menuApi.update(this.form).then(response => {
        this.$notify.success({ title: '成功', message: '修改成功' })
        this.$parent.getList()
        this.tmpVisible = false

        this.resetForm('form')
        this.form.id = null
      }).catch(e => {
        this.$notify.error({ title: '失败', message: '修改失败' })
      })
    },
    getById(id) {
      menuApi.getById(id).then(response => {
        this.form = response.data
      }).catch(e => {
        this.$notify.error({ title: '失败', message: '获取数据失败' })
      })
    },
    getMenuTree() {
      menuApi.layer().then(response => {
        console.log(response.data)
        this.menus = [{ id: '0', name: '顶级目录', children: response.data }]
        console.log(this.menus)
      })
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    resetForm(formName) {
      this.form.id = null
      this.$refs[formName].resetFields()
      this.tmpVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  /* Treeselect */
  .treeselect-main {
    width: 100%;
    line-height: 28px;
    .vue-treeselect__placeholder {
      line-height: 28px;
    }
    .vue-treeselect__control {
      height: 28px;
    }
  }

  .icon_list {
    width: 100%;
    height: 320px;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    i {
      display: inline-block;
      width: 58px;
      height: 45px;
      color: #000000;
      font-size: 20px;
      border: 1px solid #E6E6E6;
      border-radius: 4px;
      cursor: pointer;
      text-align: center;
      line-height: 45px;
      margin: 5px;

      &:hover {
        color: blue;
        border-color: blue;
      }
    }
    //::v-deep .el-tabs__content {
    //  height: 270px;
    //  overflow-y: scroll;
    //  overflow-x: hidden;
    //}
    ::v-deep .el-scrollbar__view {
      height: 270px;
    }
  }
</style>
