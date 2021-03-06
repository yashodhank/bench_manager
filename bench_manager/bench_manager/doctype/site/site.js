// Copyright (c) 2017, Frappé and contributors
// For license information, please see license.txt

frappe.ui.form.on('Site', {
	onload: function(frm) {
		if (frm.doc.__islocal != 1){
			frm.save();
		}
		frappe.realtime.on("Bench-Manager:reload-page", () => {
			frm.reload_doc();
		});
		frappe.realtime.on("Bench-Manager:drop-site", () => {
			let key = frappe.datetime.get_datetime_as_string();
			console_dialog(key);
			frappe.call({
				method: 'bench_manager.bench_manager.utils.console_command',
				args: {
					doctype: frm.doctype,
					docname: frm.doc.name,
					key: key,
					bench_command: 'drop-site'
				},
				btn: this
			});
		});
	},
	validate: function(frm) {
		if (frm.doc.db_name == undefined) {
			let key = frappe.datetime.get_datetime_as_string();
			console_dialog(key);
			frm.doc.key = key;
		}
	},
	refresh: function(frm) {
		if (frm.doc.db_name == undefined) {
			$('div.form-inner-toolbar').hide();
		} else {
			$('div.form-inner-toolbar').show();
		}
		let single_function_buttons = {
			'Migrate': 'migrate',
			'Reinstall': 'reinstall',
			'Backup Site': 'backup_site'
		};
		for (let bench_command in single_function_buttons){
			frm.add_custom_button(__(bench_command), function(){
				let key = frappe.datetime.get_datetime_as_string();
				console_dialog(key);
				frappe.call({
					method: 'bench_manager.bench_manager.utils.console_command',
					args: {
						doctype: frm.doctype,
						docname: frm.doc.name,
						key: key,
						bench_command: single_function_buttons[bench_command]
					},
					btn: this
				});
			});
		}
		frm.add_custom_button(__('Install App'), function(){
			frappe.call({
				method: 'bench_manager.bench_manager.doctype.site.site.get_installable_apps',
				args: {
					doctype: frm.doctype,
					docname: frm.doc.name
				},
				btn: this,
				callback: function(r) {
					var dialog = new frappe.ui.Dialog({
						title: 'Select App',
						fields: [
							{'fieldname': 'installable_apps', 'fieldtype': 'Select', options: r.message}
						],
					});
					dialog.set_primary_action(__("Install"), () => {
						let key = frappe.datetime.get_datetime_as_string();
						console_dialog(key);
						frappe.call({
							method: 'bench_manager.bench_manager.utils.console_command',
							args: {
								doctype: frm.doctype,
								docname: frm.doc.name,
								app_name: cur_dialog.fields_dict.installable_apps.value,
								key: key,
								bench_command: 'install_app'								
							},
							callback: function(){
								dialog.hide();
							}
						});
					});
					dialog.show();
				}
			});
		});
		frm.add_custom_button(__('Uninstall App'), function(){
			frappe.call({
				method: 'bench_manager.bench_manager.doctype.site.site.get_removable_apps',
				args: {
					doctype: frm.doctype,
					docname: frm.doc.name
				},
				btn: this,
				callback: function(r) {
					var dialog = new frappe.ui.Dialog({
						title: 'Select App',
						fields: [
							{'fieldname': 'removable_apps', 'fieldtype': 'Select', options: r.message},
						],
					});
					dialog.set_primary_action(__("Remove"), () => {
						let key = frappe.datetime.get_datetime_as_string();
						console_dialog(key);
						frappe.call({
							method: 'bench_manager.bench_manager.utils.console_command',
							args: {
								doctype: frm.doctype,
								docname: frm.doc.name,
								app_name: cur_dialog.fields_dict.removable_apps.value,
								key: key,
								bench_command: 'remove_app'
							},
							callback: function(){
								dialog.hide();
							}
						});
					});
					dialog.show();
				}
			});
		});
	}
});