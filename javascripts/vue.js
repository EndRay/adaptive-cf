var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        harder: [],
        easier: [],
        solved: [],
        handle: "tourist",
        rating: 0
    },
    methods:{
        get_problems: function () {
            $.getJSON('data-ru.json', function(task){
                this.harder = task.filter(function (problem) {
                    return problem.average >= this.rating;
                }.bind(this)).sort(function (a, b) {
                    return a.average - b.average;
                });
                this.easier = task.filter(function (problem) {
                    return problem.average < this.rating;
                }.bind(this)).sort(function (a, b) {
                    return b.average - a.average;
                });
            }.bind(this));
        },
        get_rating: function (callback) {
            $.getJSON('http://codeforces.com/api/user.info?handles=' + this.handle, function(task){
                this.rating = task['result'][0]['rating'] || 1500;
                callback();
            }.bind(this));
        },
        get_solved: function () {
            $.getJSON('http://codeforces.com/api/user.status?handle='+ this.handle + '&from=1&count=10000', function(task){
                var solved = {};
                task['result'].forEach(function (el, i, arr) {
                    var problem = el['problem'];
                    if (solved[problem['contestId']] === undefined)
                        solved[problem['contestId']] = {};
                    solved[problem['contestId']][problem['index']] =
                        el['verdict'] === 'OK' || solved[problem['contestId']][problem['index']] === "solved" ? "solved" : "tried";
                });
                this.solved = solved;
            }.bind(this));
        },
        load_info: function () {
            app.get_solved();
            app.get_rating(app.get_problems);
        }
    },
});

app.load_info();
