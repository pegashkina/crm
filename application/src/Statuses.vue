<template>
    <main>
        <vheader>{{title}}</vheader>
        <template v-if="tableBody.length > 0 && dataLoaded">
            <table-create
                    title="Добавление статуса сделки"
                    type="status"
                    :fields="editorFields"
                    @saved="getTable">Добавить статус сделки</table-create>
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
            <table-modify
                    :selectedRows="selectedRows"
                    @deleted="getTable"
                    @toEdit="openEditor = arguments[0]"
                    type="status" />
            <table-edit
                    v-if="!!openEditor"
                    :row="getByID(openEditor)"
                    :show="!!openEditor"
                    @close="openEditor = ''"
                    @edited="getTable"
                    title="Редактирование статуса сделки"
                    type="status"
                    :fields="editorFields"/>
        </template>
        <template v-if="tableBody.length == 0 && dataLoaded">
            <div class="uk-alert">
                <h3>Записи не найдены</h3>
                <p>Прямо сейчас вы можете создать первый статус сделки</p>
                <table-create title="Добавление статуса сделки" type="status" :fields="editorFields">Добавить статус сделку</table-create>
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
                order: 'asc'
            },
            tableHead: [{
                name: 'order',
                sortBy: true,
                header: 'Порядок'
            }, {
                name: 'title',
                sortBy: true,
                header: 'Название'
            }, {
                name: 'color',
                sortBy: true,
                header: 'Цвет'
            }],
            tableBody: [],
            selectedRows: [],
            editorFields: [
                { name: 'Название', type: 'text',   model: 'title' },
                { name: 'Цвет',     type: 'color',  model: 'color' },
                { name: 'Порядок',  type: 'number', model: 'order' }
            ]
        }),
        methods: {
            getTable: function() {
                this.$http.get(`${this.$APIURL}/api/v1/status/get`,{
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