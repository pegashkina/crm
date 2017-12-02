<template>
  <main>
    <vheader>{{title}}</vheader>
    <template v-if="tableBody.length > 0 && dataLoaded">
      <table-create
              title="Добавление контакта"
              type="contact"
              :fields="editorFields"
              @saved="getTable">Добавить контакт</table-create>
      <vtable ref="table"
        trackBy="id"
        :fields="tableHead"
        :rows="sortedRows"
        :selectedRows="selectedRows"
        :selectable="true"
        :condensed="true"
        :striped="false"
        :hover="false"
        :sort-order="sortOrder"
        @sort="
          events.sort.emited = true,
          sortOrder = arguments[0]
        " @select="
          events.select.emited = true,
          selectedRows = arguments[0]
        " @unselect="
          events.unselect.emited = true,
          selectedRows = arguments[0]
        ">
      </vtable>
      <table-modify type="contact" :selectedRows="selectedRows" @deleted="getTable" @toEdit="openEditor = arguments[0]"/>
      <table-edit
              v-if="!!openEditor"
              :row="getByID(openEditor)"
              :show="!!openEditor"
              @close="openEditor = ''"
              @edited="getTable"
              title="Редактирование контакта"
              type="contact"
              :fields="editorFields"/>
    </template>
    <template v-if="tableBody.length == 0 && dataLoaded">
      <div class="uk-alert">
        <h3>Записи не найдены</h3>
        <p>Прямо сейчас вы можете создать первый контакт</p>
        <table-create
                title="Добавление контакта"
                type="contact"
                :fields="editorFields"
                @saved="getTable">Добавить контакт</table-create>
      </div>
    </template>
    <vfooter></vfooter>
  </main>
</template>

<script>
    import { orderBy } from 'lodash'
    import vtable from './components/table/';
    import tableCreate from './components/global/tableCreate.vue';
    import tableEdit from './components/global/tableEdit.vue';
    import tableModify from './components/global/tableModify.vue';

    export default {
        components: {
            vtable: vtable,
            tableCreate: tableCreate,
            tableModify: tableModify,
            tableEdit: tableEdit
        },
        data: () => ({
            openEditor: '',
            title: '',
            dataLoaded: false,
            events: {
                sort: {
                    emited: false
                },
                select: {
                    emited: false
                },
                unselect: {
                    emited: false
                }
            },
            sortOrder: {
                dateEdit: 'desc'
            },
            tableHead: [{
                name: 'name',
                sortBy: true,
                header: 'ФИО',
                pickable: {linkTo: 'contact'}
            }, {
                name: 'tel',
                sortBy: true,
                header: 'Телефон'
            }, {
                name: 'email',
                sortBy: true,
                header: 'Email'
            }],
            tableBody: [],
            selectedRows: [],
            editorFields: [
                { name: 'ФИО',     type: 'text',  model: 'name'  },
                { name: 'Адрес',   type: 'text',  model: 'city'  },
                { name: 'Телефон', type: 'tel',   model: 'tel'   },
                { name: 'Email',   type: 'email', model: 'email' },
                { name: 'Комментарий', type: 'desc',   model: 'comment'   }
            ]
        }),
        methods: {
            getTable: function() {
                this.$http.get(`${this.$APIURL}/api/v1/contact/get`,{
                    headers: { 'Authorization': `Bearer ${this.$cookie.get('token')}` }
                }).then(function(r) {
                    this.selectedRows = [];
                    this.tableBody = r.body;
                    this.dataLoaded = true;
                }).catch(function (e) {
                    console.error(e);
                    this.dataLoaded = true;
                });
            },
            getByID: function (search) {
                var i = this.tableBody.length;
                while (i--) {
                    if (this.tableBody[i].id === search) {
                        return this.tableBody[i];
                    }
                }
            }
        },
        created: function() {
            this.title = this.$route.meta.title;
            this.getTable();
        },
        computed: {
            sortedRows () {
                for (var key in this.tableBody) {
                    this.tableBody[key].id = this.tableBody[key]._id;
                }
                const by = Object.keys(this.sortOrder)[0]
                const dir = this.sortOrder[by]
                return orderBy(this.tableBody, [item => item[by]], dir)
            }
        }
    }

</script>
<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to {
    opacity: 0
  }
</style>