frappe.listview_settings['Site'] = {
	formatters: {
		app_list: function(val) {
			return val.split('\n').join(', ');
		}		
	},
	onload: function(list) {
		frappe.realtime.on("Bench-Manager:drop-site", (data) => {
			let key = frappe.datetime.get_datetime_as_string();
			console_dialog(key);
			frappe.call({
				method: 'bench_manager.bench_manager.utils.console_command',
				args: {
					doctype: list.doctype,
					docname: data.site_name,
					key: key,
					bench_command: 'drop-site'
				},
				btn: this
			});
		});
	}
};