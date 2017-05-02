/*=============================================================
 * bootstrap-typeahead.js v2.0.3
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 * modified by jasonkou @2012-10-2
 * ============================================================ */

/*
 *
 * Modifications by Paul Warelis
 *
 */

! function($) {

	"use strict"; // jshint ;_;
	/* TYPEAHEAD PUBLIC CLASS DEFINITION
	 * ================================= */

	var Typeahead = function(element, options) {
		this.$element = $(element)
		this.options = $.extend({}, $.fn.typeahead.defaults, options)
		this.matcher = this.options.matcher || this.matcher
		this.sorter = this.options.sorter || this.sorter
		this.highlighter = this.options.highlighter || this.highlighter
		this.updater = this.options.updater || this.updater
		this.selectItems = this.options.selectItems || this.selectItems
		this.$menu = $(this.options.menu).appendTo('body')
		if (this.options.ajax) {
			var ajax = this.options.ajax;
			if (typeof ajax == "string") {
				ajax = {
					url: ajax
				};
			}
			this.ajax = {
				url: ajax.url,
				timeout: ajax.timeout || 300,
				method: ajax.method || "post",
				triggerLength: ajax.triggerLength || 3,
				loadingClass: ajax.loadingClass || null,
				displayField: ajax.displayField || null,
				preDispatch: ajax.preDispatch || null,
				preProcess: ajax.preProcess || null
			}
			this.query = "";
		} else {
			this.source = this.options.source
			this.propertyName = this.options.propertyName
			this.ajax = null
		}
		this.queryData = this.getQueryData()
		this.shown = false
		this.selectedCallBack = this.options.selectedCallBack || function(){}; //选择值之后的回调，add by thinking
		this.listen()
	}

	Typeahead.prototype = {

		constructor: Typeahead,
		destroyTypeAhead: function() { //added by thinking
			this.$menu.remove();
			this.source = null;
			this.queryData = null;
		},
		refreshData: function(newData) { //added by thinking
			//更新数据集
			this.source = newData;
			this.queryData = this.getQueryData();
		},
		getQueryData: function() {
			var res = {}
			if (this.source == null || this.source.length == 0) {
				var jAjax = (this.ajax.method == "post") ? $.post : $.get
				jAjax(this.ajax.url, '', function(data) {
					$.each(data, function(k, v) {
						res[v[this.propertyName] || v.name || v] = 1
					})
				})
			} else {
				//如果是名字选择组件
				if (this.options.hasOwnProperty("nameType")) {
					var nameType = this.options.nameType;
					// english, chinese, fullname(英文+中文);
					if (nameType === "english") {
						$.each(this.source, function(k, v) {
							res[v.substring(0, v.indexOf("("))] = 1;
						})
					} else if (nameType === "chinese") {
						$.each(this.source, function(k, v) {
							res[v.substring(v.indexOf("(") + 1, v.indexOf(")"))] = 1;
						})
					} else {
						$.each(this.source, function(k, v) {
							res[v] = 1;
						})
					}
				} else {
					$.each(this.source, function(k, v) {
						res[v[this.propertyName] || v.name || v] = 1
					})
				}
			}
			delete res[""]; //删除空字段
			return res;
		},
		select: function() {
			var val = this.$menu.find('.active').attr('data-value'),
				res = this.$element.val();

			if (this.selectItems == 1) {
				this.$element.val(this.updater(val)).change();
			} else {
				if (res.length && res.indexOf(';') != -1) {
					res = res.slice(0, res.lastIndexOf(';')) + ';' + this.updater(val);
				} else {
					res = this.updater(val);
				}
				res = res.replace(/^;/, '');
				this.$element.val(res).change()
			}
			this.selectedCallBack.call(this, this.$element.val()); //执行选择值之后的回调，add by thinking
			return this.hide()
		},

		updater: function(item) {
			var nameType = this.options.nameType;
			// english, chinese, fullname(英文+中文);
			if (nameType === "english") {
				return item.substring(0, item.indexOf("(")) + ';';
			} else if (nameType === "chinese") {
				return item.substring(item.indexOf("(") + 1, item.indexOf(")")) + ';';
			} else {
				return item + ';'
			}
		},

		show: function() {
			var pos = $.extend({}, this.$element.offset(), {
				height: this.$element[0].offsetHeight
			})

			this.$menu.css({
				top: pos.top + pos.height,
				left: pos.left
			})

			this.$menu.show()
			this.shown = true
			return this
		},

		hide: function() {
			this.$menu.hide()
			this.shown = false
			return this
		},

		getLastWord: function(text) {
			var idx = text.lastIndexOf(';')
			return text.slice(idx == -1 ? 0 : idx + 1)
		},
		getSelectedWord: function(text) {
			var idx = text.lastIndexOf(';')
			if (idx === -1) return ''
			return text.slice(0, idx)
		},
		ajaxLookup: function() {

			var query = this.getLastWord(this.$element.val())

			if (query == this.query) {
				return this;
			}

			// Query changed
			this.query = query

			// Cancel last timer if set
			if (this.ajax.timerId) {
				clearTimeout(this.ajax.timerId);
				this.ajax.timerId = null;
			}

			if (!query || query.length < this.ajax.triggerLength) {
				// cancel the ajax callback if in progress
				if (this.ajax.xhr) {
					this.ajax.xhr.abort();
					this.ajax.xhr = null;
					this.ajaxToggleLoadClass(false);
				}
				return this.shown ? this.hide() : this
			}

			function execute() {
				this.ajaxToggleLoadClass(true);

				// Cancel last call if already in progress
				if (this.ajax.xhr) this.ajax.xhr.abort();

				var params = this.ajax.preDispatch ? this.ajax.preDispatch(query) : {
					query: query
				}
				var jAjax = (this.ajax.method == "post") ? $.post : $.get;
				this.ajax.xhr = jAjax(this.ajax.url, params, $.proxy(
					this.ajaxSource, this));
				this.ajax.timerId = null;
			}

			// Query is good to send, set a timer
			this.ajax.timerId = setTimeout($.proxy(execute, this), this.ajax.timeout);

			return this;
		},

		ajaxSource: function(data) {
			this.ajaxToggleLoadClass(false);

			var that = this,
				items

			if (!this.ajax.xhr) return;

			if (this.ajax.preProcess) {
				data = this.ajax.preProcess(data);
			}
			// Save for selection retreival
			this.ajax.data = data;

			items = $.grep(data, function(item) {
				if (that.ajax.displayField) {
					item = item[that.ajax.displayField]
				}
				if (that.matcher(item)) return item
			})

			items = this.sorter(items)

			if (!items.length) {
				return this.shown ? this.hide() : this
			}

			this.ajax.xhr = null;
			return this.render(items.slice(0, this.options.items)).show()
		},

		ajaxToggleLoadClass: function(enable) {
			if (!this.ajax.loadingClass) return;
			this.$element.toggleClass(this.ajax.loadingClass, enable);
		},

		lookup: function(event) {
			var that = this,
				items

			this.query = this.getLastWord(this.$element.val())

			if (!this.query) {
				return this.shown ? this.hide() : this
			}

			items = $.grep(this.source, function(item) {
				return that.matcher(item)
			})

			items = this.sorter(items)

			if (!items.length) {
				return this.shown ? this.hide() : this
			}

			return this.render(items.slice(0, this.options.items)).show()
		},

		matcher: function(item) {
			return ~item.toLowerCase().indexOf(this.query.toLowerCase())
		},

		sorter: function(items) {
			var beginswith = [],
				caseSensitive = [],
				caseInsensitive = [],
				item

			while (item = items.shift()) {
				if (this.ajax && this.ajax.displayField) {
					item = item[this.ajax.displayField]
				}
				if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
				else if (~item.indexOf(this.query)) caseSensitive.push(item)
				else caseInsensitive.push(item)
			}

			return beginswith.concat(caseSensitive, caseInsensitive)
		},

		highlighter: function(item) {
			var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
			return item.replace(new RegExp('(' + query + ')', 'ig'), function(
				$1, match) {
				return '<strong>' + match + '</strong>'
			})
		},

		render: function(items) {
			var that = this

			items = $(items).map(function(i, item) {
				i = $(that.options.item).attr('data-value', item)
				i.find('a').html(that.highlighter(item))
				return i[0]
			})

			items.first().addClass('active')
			this.$menu.html(items)
			return this
		},

		next: function(event) {
			var active = this.$menu.find('.active').removeClass('active'),
				next = active.next()

			if (!next.length) {
				next = $(this.$menu.find('li')[0])
			}

			next.addClass('active')
		},

		prev: function(event) {
			var active = this.$menu.find('.active').removeClass('active'),
				prev = active.prev()

			if (!prev.length) {
				prev = this.$menu.find('li').last()
			}

			prev.addClass('active')
		},

		listen: function() {
			this.$element.on('blur', $.proxy(this.blur, this)).on('keypress', $.proxy(this.keypress, this)).on('keyup', $.proxy(this.keyup, this))

			// Firefox needs this too
			this.$element.on('keydown', $.proxy(this.keypress, this))

			this.$element.on('focus', $.proxy(this.focus, this))

			this.$menu.on('click', $.proxy(this.click, this)).on('mouseenter', 'li', $.proxy(this.mouseenter, this))
		},

		keyup: function(e) {
			switch (e.keyCode) {
				case 40:
					// down arrow
				case 38:
					// up arrow
					break

				case 9:
					// tab
				case 13:
					// enter
					if (!this.shown) return
					this.select()
					break

				case 27:
					// escape
					if (!this.shown) return
					this.hide()
					break

				default:
					if (this.ajax) this.ajaxLookup()
					else this.lookup()
			}

			e.stopPropagation()
			e.preventDefault()
		},

		keypress: function(e) {
			if (!this.shown) return

			switch (e.keyCode) {
				case 9:
					// tab
				case 13:
					// enter
				case 27:
					// escape
					e.preventDefault()
					break

				case 38:
					// up arrow
					if (e.type != 'keydown') break
					e.preventDefault()
					this.prev()
					break

				case 40:
					// down arrow
					if (e.type != 'keydown') break
					e.preventDefault()
					this.next()
					break
			}

			e.stopPropagation()
		},

		deleteWrongItems: function() {
			var that = this,
				map = {},
				items = this.$element.val().split(';'),
				newArr = [];
			// exist 2+ times
			if (items.length < 2) {
				if (items.length == 1) {
					that.queryData[items[0]] ? '' : this.$element.val('')
				}
				if (this.$element.val() == '') {
					if (this.$element.attr('default-text'))
						this.$element.val(this.$element.attr('default-text'));
				}
				//console.log(that.queryData[items[0]], items[0])
				return;
			}
			$.each(items, function(k, v) {
				if (that.queryData[v]) map[v] = v
			})
			$.each(map, function(k, v) {
					newArr.push(v)
				})
				//console.log(newArr)
			this.$element.val(newArr.join(';') + ";");

			if (this.$element.val() == ';') {
				this.$element.val('');
				if (this.$element.attr('default-text'))
					this.$element.val(this.$element.attr('default-text'));
			}

			this.$element.trigger('change')
		},

		blur: function(e) {
			var that = this
			setTimeout(function() {
					that.deleteWrongItems()
					that.hide()
				}, 150)
				// if not in list, kill it
		},
		change: function(e) {
			var that = this
			setTimeout(function() {
					that.deleteWrongItems()
					that.hide()
				}, 150)
				// if not in list, kill it
		},

		click: function(e) {
			e.stopPropagation()
			e.preventDefault()
			this.select()
		},

		mouseenter: function(e) {
			this.$menu.find('.active').removeClass('active')
			$(e.currentTarget).addClass('active')
		},

		focus: function(e) {
			if (this.$element.val() == this.$element.attr('default-text'))
				this.$element.val('')
			e.preventDefault()
			e.stopPropagation()
		}
	}

	/* TYPEAHEAD PLUGIN DEFINITION
	 * =========================== */

	$.fn.typeahead = function(option) {
		return this.each(function() {
			var $this = $(this),
				data = $this.data('typeahead'),
				options = typeof option == 'object' && option
			if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
			if (typeof option == 'string') data[option]()
		})
	}

	$.fn.typeahead.defaults = {
		source: [],
		items: 4,
		menu: '<ul class="typeahead dropdown-menu"></ul>',
		item: '<li><a href="#"></a></li>',
		selectItems: 1
	}

	$.fn.typeahead.Constructor = Typeahead

	/* TYPEAHEAD DATA-API
	 * ================== */

	$(function() {


		// ajax typeahead
		$('.ajax[data-provide="typeahead"]').each(function() {
			var $this = $(this),
				url = $this.attr('data-url');
			if (url) {
				$this.typeahead({
					ajax: {
						url: $(this).attr('data-url'),
						triggerLength: 1,
						method: 'get'
					},
					items: 4,
					selectItems: 1
				});
			}
		});


		// local typeahead
		$('[data-provide="typeahead"]').each(function() {
			var $this = $(this),
				url = $this.attr('data-url'),
				propertyName = $this.attr('property-name');
			if (url) {
				$.get(url, function(data) {
					if (data.items && data.items.length) {
						$this.typeahead({
							source: data.items,
							items: 4,
							selectItems: 10
						});
					}

				}, 'json');
			}
		});


		//
		$('body').on('focus.typeahead.data-api', '[data-provide="typeahead"]', function(e) {
			var $this = $(this)
			if ($this.data('typeahead')) return
			e.preventDefault()
			$this.typeahead($this.data())
		})
	})

}(window.jQuery);