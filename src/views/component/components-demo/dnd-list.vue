<template>
  <div class="components-container">
    <aside>drag-list base on
      <a href="https://github.com/SortableJS/Vue.Draggable" target="_blank">Vue.Draggable</a>
    </aside>
    <div class="editor-container">
      <dnd-list :list1="list1" :list2="list2" list1-title="List" list2-title="Article pool" />
    </div>
  </div>
</template>

<script>
import DndList from '@/components/DndList'

export default {
  name: 'DndListDemo',
  components: { DndList },
  data() {
    return {
      list1: [],
      list2: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.listLoading = true
      const items = [
        { id: '1', author: '1', title: '1' },
        { id: '2', author: '2', title: '2' },
        { id: '3', author: '3', title: '3' },
        { id: '4', author: '4', title: '4' },
        { id: '5', author: '5', title: '5' },
        { id: '6', author: '6', title: '6' },
        { id: '7', author: '7', title: '7' },
        { id: '8', author: '8', title: '8' },
        { id: '9', author: '9', title: '9' },
      ]
      this.list1 = items.splice(0, 5)
      this.list2 = items
    }
  }
}
</script>

