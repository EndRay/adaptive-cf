var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        harder: [],
        easier: [],
        solved: [],
		harder_d: [],
        tags: [],
        chosen_tags: [],
        selected_tag: "",
        handle: localStorage.getItem("handle"),
		country: "a",
		city: "a",
		rank: "a",
		max_rank: "a",
		register_time: "2018",
        rating: 0
    },
    methods:{
        get_problems: function () {
            $.getJSON('data-ru.json', function(task){
                task.forEach(function (el) {
                    el.tags.forEach(function (tag) {
                        if(this.tags.includes(tag))
                            return;
                        this.tags.push(tag);
                    }.bind(this));
                }.bind(this));
                this.harder = task.filter(function (problem) {
                    return problem.average >= this.rating;
                }.bind(this)).sort(function (a, b) {
                    return a.average - b.average;
                });
				this.harder_d = task.filter(function (problem) {
                    return problem.average >= this.rating;
                }.bind(this)).sort(function (a, b) {
                    return b.average - a.average;
                });
                this.easier = task.filter(function (problem) {
                    return problem.average < this.rating;
                }.bind(this)).sort(function (a, b) {
                    return b.average - a.average;
                });
            }.bind(this));
        },
		go: function(contest, index) {
			window.open('http://codeforces.com/problemset/problem/' + contest + '/' + index, '_blank');
		},
        get_rating: function (callback) {
            $.getJSON('https://codeforces.com/api/user.info?handles=' + this.handle, function(task){
                this.rating = task['result'][0]['rating'] || 1500;
				this.max_rank = task['result'][0]['maxRank'] || "none";
				this.country = task['result'][0]['country'] || "none";
				this.city = task['result'][0]['city'] || "none";
				this.rank = task['result'][0]['rank'] || "none";
				this.register_time = new Date(task['result'][0]['registrationTimeSeconds'] * 1000).toLocaleDateString() || "none";
                callback();
            }.bind(this));
        },
        get_solved: function () {
            $.getJSON('https://codeforces.com/api/user.status?handle='+ this.handle + '&from=1&count=10000', function(task){
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
			localStorage.setItem("handle", this.handle);
			app.get_solved();
            app.get_rating(app.get_problems);
        },
        tags_compare: function (tags) {
            return this.chosen_tags.reduce(function (acc, x) {
                return acc && tags.includes(x);
            }, true);
        },
        change_tag_state: function (tag) {
            if(this.chosen_tags.includes(tag))
                this.chosen_tags.splice(this.chosen_tags.indexOf(tag), 1);
            else
                this.chosen_tags.push(tag);
        }
    },
});

app.load_info();
