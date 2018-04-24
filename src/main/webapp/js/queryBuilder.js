
//查询条件构建工具
(function () {
    var logics = [
        {name: 'equal', op: 'equal', text: '等于'},
        {name: 'like', op: 'like', text: '包含'},
        {name: 'greaterorequal', op: '>=', text: '大于等于'},
        {name: 'lessorequal', 'op': '<=', text: '小于等于'}
    ];

    /**
     * 查询条件构建类
     * @param {type} op 逻辑符
     * @returns {api_L402.QueryBuilder}
     */
    function QueryBuilder(op) {
        this.data = {
            rules: [],
            groups: [],
            op: ifn(op, 'and')
        }
    }

    //查询条件
    function QueryRule(field, builder) {
        this.data = {field: field, value: null, op: 'and'};
        this.builder = builder;
    }

    /**
     * 添加一个列条件表达式
     * @param column 列名
     * @param op 表达式操作符
     * @param v 表示对比值
     * @returns {undefined}
     */
    QueryBuilder.prototype.rule = function (column, op, v) {
        var rule = new QueryRule(column, this);
        this.data.rules.push(rule.data);
        if (!isFunction(rule[op])) {
            rule.data.value = v;
            rule.data.op = op;
        } else {
            rule[op](v);
        }
        return this;
    }

    /**
     * 添加一个列条件表达式
     * @param column 列名
     * @returns {undefined}
     */
    QueryBuilder.prototype.column = function (column) {
        var rule = new QueryRule(column, this);
        this.data.rules.push(rule.data);
        return rule;
    }

    /**
     * 添加一个and 条件组 表达式
     * @param column 列名
     * @returns {undefined}
     */
    QueryBuilder.prototype.and = function (column) {
        var group = new QueryBuilder('and');
        this.data.groups.push(group.data);
        return group.column(column);
    }

    /**
     * 添加一个or 条件组 表达式
     * @param column 列名
     * @returns {undefined}
     */
    QueryBuilder.prototype.or = function (column) {
        var group = new QueryBuilder('or');
        this.data.groups.push(group);
        return group.column(column);
    }


    //动态创建逻辑表达式
    function createColumnLogics() {
        var item = null;
        for (var i = 0, k = logics.length; i < k; i++) {
            item = logics[i];
            createColumnLogic(item.name, item.op);
        }
    }

    //创建单个逻辑表达式
    function createColumnLogic(name, op) {
        QueryRule.prototype[name] = function (v) {
            var d = this.data;
            d.op = op;
            d.value = v;
            return this.builder;
        }
    }

    //动态创建逻辑表达式
    createColumnLogics();

    LG.QueryBuilder = QueryBuilder;

}());