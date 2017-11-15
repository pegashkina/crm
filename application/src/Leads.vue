<template>
    <main>
        <vheader>{{title}}</vheader>
        <template v-if="tableBody.length > 0 && dataLoaded">
            <table-create
                    title="Добавление сделки"
                    type="lead"
                    :fields="editorFields"
                    @saved="getTable">Добавить сделку</table-create>
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
                    type="lead" />
            <table-edit
                    v-if="!!openEditor"
                    :row="getByID(openEditor)"
                    :show="!!openEditor"
                    @close="openEditor = ''"
                    @edited="getTable"
                    title="Редактирование сделки"
                    type="lead"
                    :fields="editorFields"/>
        </template>
        <template v-if="tableBody.length == 0 && dataLoaded">
            <div class="uk-alert">
                <h3>Записи не найдены</h3>
                <p>Прямо сейчас вы можете создать первую сделку</p>
                <table-create
                        title="Добавление сделки"
                        type="lead"
                        :fields="editorFields"
                        @saved="getTable">Добавить сделку</table-create>
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
                name: 'title',
                sortBy: true,
                header: 'Название',
                pickable: {linkTo: 'lead'}
            }, {
                name: 'status',
                sortBy: true,
                header: 'Статус'
            }, {
                name: 'contactsId',
                sortBy: false,
                header: 'Контакт'
            }],
            tableBody: [],
            selectedRows: [],
            editorFields: [
                { name: 'Название', type: 'text',  model: 'title'      },
                { name: 'Описание', type: 'desc',  model: 'description' }
            ]
        }),
        methods: {
            getTable: function() {
                this.$http.get(`${this.$APIURL}/api/v1/lead/get`,{
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