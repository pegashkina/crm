<template>
    <main>
        <vheader>{{title}}</vheader>
        <table-create
                title="Добавление сотрудника"
                type="user"
                :fields="editorFields"
                @saved="getTable">Добавить сотрудника</table-create>
        <vtable ref="table"
                trackBy="_id"
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
                type="user" />
        <table-edit
                v-if="!!openEditor"
                :row="getByID(openEditor)"
                :show="!!openEditor"
                @close="openEditor = ''"
                @edited="getTable"
                title="Редактирование сделки"
                type="user"
                :fields="editorFields"/>
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
                username: 'asc'
            },
            tableHead: [{
                name: 'username',
                sortBy: true,
                header: 'Логин'
            },{
                name: 'firstName',
                sortBy: true,
                header: 'Имя'
            },{
                name: 'lastName',
                sortBy: true,
                header: 'Фамилия'
            },{
                name: 'tel',
                sortBy: true,
                header: 'Телефон'
            },{
                name: 'email',
                sortBy: true,
                header: 'Почта'
            }],
            tableBody: [],
            selectedRows: [],
            editorFields: [
                { name: 'Логин',   type: 'text',  model: 'username' },
                { name: 'Пароль',  type: 'text',  model: 'password'  },
                { name: 'Имя',     type: 'text',  model: 'firstName' },
                { name: 'Фамилия', type: 'text',  model: 'lastName'  },
                { name: 'Телефон', type: 'tel',   model: 'tel'   },
                { name: 'Email',   type: 'email', model: 'email' }
            ]
        }),
        methods: {
            getTable: function () {
                this.$http.get(`${this.$APIURL}/api/v1/user/get`, {
                    headers: {
                        'Authorization': `Bearer ${this.$cookie.get('token')}`
                    }
                }).then(function (data) {
                    this.tableBody = data.body;
                }).catch(function (e) {
                    console.log(e);
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
                const by = Object.keys(this.sortOrder)[0]
                const dir = this.sortOrder[by]
                return orderBy(this.tableBody, [item => item[by]], dir)
            }
        }
    }
</script>