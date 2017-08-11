/**
 * AnnouncementController
 *
 * @description :: Server-side logic for managing announcements
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var sanitizeHtml = require('sanitize-html');

module.exports = {

	create: function (req, res) {
		var title = null;
		var content = null;
		var createdAt = null;
		var updatedAt = null;
		var announcementCredentials = null;

		title = req.param('title');
		if (!title) {
			return res.badRequest({code: 1, msg: 'Missing title.'});
		}

		content = req.param('content');
		if (!content) {
			return res.badRequest({code: 1, msg: 'Missing content.'});
		}
		// content = sanitizeHtml(content); // Cleans the html from unwanted scripting.

		createdAt = TimeZoneService.getDate({offset: -300});
		updatedAt = createdAt;

		announcementCredentials = {
			user: req.user.id,
			title: title,
			content: content,
			createdAt: createdAt,
			updatedAt: updatedAt
		}

		Announcement.create(announcementCredentials)
		.then(function (resData) {
			return res.created();
		})
		.catch(function (err) {
			return res.serverError(err);
		});
	},

	update: function (req, res) {
		var id = null;
		var title = null;
		var content = null;
		var updatedAt = null;
		var announcementCredentials = null;

		id = req.param('id');
		if (!id) {
			return res.badRequest({code:1, msg:'Missing id'});
		}

		title = req.param('title');
		if (!title) {
			return res.badRequest({code: 1, msg: 'Missing title.'});
		}

		content = req.param('content');
		if (!content) {
			return res.badRequest({code: 1, msg: 'Missing content.'});
		}
		// content = sanitizeHtml(content); // Cleans the html from unwanted scripting.

		updatedAt = TimeZoneService.getDate({offset: -300});

		announcementCredentials = {
			title: title,
			content: content,
			updatedAt: updatedAt
		}

		Announcement.update({id: id}, announcementCredentials)
		.then(function (resData) {
			return res.ok(resData);
		})
		.catch(function (err) {
			sails.log.debug(err);
			return res.serverError(err);
		});
	},

	delete: function (req, res) {
		var id = req.param('id');
		if (!id) {
			return res.badRequest({code:1 , msg: 'Missing ID'});
		}

		Announcement.destroy({id: id})
		.then(function (resData) {
			return res.ok();
		})
		.catch(function (err) {
			return res.serverError(err);
		});
	},

	getAll: function (req, res) {
		Announcement.find().sort('createdAt DESC')
		.then(function (resData) {
			return res.ok(resData)
		})
		.catch(function (err) {
			return res.serverError(err);
		});
	}
};
