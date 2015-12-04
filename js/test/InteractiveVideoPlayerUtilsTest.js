//BEGIN helper for html and karma usage
var path = '';
if (typeof window.__karma__ !== 'undefined') {
	path += 'base/' //used for fixtures in karma
}
else {
	var $j = $; //used for event listeners in karma
}
jasmine.getFixtures().fixturesPath = path + 'spec/javascripts/fixtures';
//END helper for html and karma usage

describe("InteractiveVideoPlayerUtils Tests", function () {

	describe("HTML Builder Test Cases", function () {
		beforeEach(function () {
			question_text = 'Question';
			private_text = 'private';
		});
		afterEach(function () {
		});

		it("InteractiveVideoQuestionCreator object must exists", function () {
			expect(typeof il.InteractiveVideoPlayerUtils).toEqual('object');
		});

		it("builCommentTextHtml must return html", function () {
			var expec = '<span class="comment_text">My little text</span> ';
			var value = il.InteractiveVideoPlayerUtils.protect.builCommentTextHtml('My little text');
			expect(value).toEqual(expec);
		});

		it("builCommentTitleHtml must return html", function () {
			var expec = '<span class="comment_title">My little text</span> ';
			var value = il.InteractiveVideoPlayerUtils.protect.builCommentTitleHtml('My little text');
			expect(value).toEqual(expec);
			expec = '<span class="comment_title"></span> ';
			value = il.InteractiveVideoPlayerUtils.protect.builCommentTitleHtml(null);
			expect(value).toEqual(expec);
		});

		it("builCommentUsernameHtml must return html", function () {
			var expec = '<span class="comment_username"> [Username]</span> ';
			var value = il.InteractiveVideoPlayerUtils.protect.builCommentUsernameHtml('Username', 0);
			expect(value).toEqual(expec);
			expec = '<span class="comment_username"> [Question]</span> ';
			value = il.InteractiveVideoPlayerUtils.protect.builCommentUsernameHtml('Username', 1);
			expect(value).toEqual(expec);
			expec = '<span class="comment_username"> </span> ';
			value = il.InteractiveVideoPlayerUtils.protect.builCommentUsernameHtml('', 0);
			expect(value).toEqual(expec);
		});

		it("builCommentPrivateHtml must return html", function () {
			var expec = '<span class="private_text"> (private)</span> ';
			var value = il.InteractiveVideoPlayerUtils.protect.appendPrivateHtml(1);
			expect(value).toEqual(expec);
			expec = '<span class="private_text"></span> ';
			value = il.InteractiveVideoPlayerUtils.protect.appendPrivateHtml(0);
			expect(value).toEqual(expec);
		});

		it("builCommentTimeHtml must return html", function () {
			var expec = '<time class="time"> <a onClick="il.InteractiveVideoPlayerUtils.jumpToTimeInVideo(61); return false;">undefined</a></time>';
			var value = il.InteractiveVideoPlayerUtils.protect.builCommentTimeHtml(61, 0);
			expect(value).toEqual(expec);
			expec = '<time class="time"> <a onClick="il.InteractiveVideoPlayerUtils.jumpToTimeInVideo(60.9); return false;">undefined</a></time>';
			value = value = il.InteractiveVideoPlayerUtils.protect.builCommentTimeHtml(61, 1);
			expect(value).toEqual(expec);
		});

		it("builCommentTagsHtml must return html", function () {
			var tags = 'Tag1, Tag2';
			var expec = '<br/><div class="comment_tags"><span class="tag">Tag1</span> <span class="tag"> Tag2</span> </div>';
			var value = il.InteractiveVideoPlayerUtils.protect.builCommentTagsHtml(tags);
			expect(value).toEqual(expec);
			expec = '<br/><div class="comment_tags"></div>';
			value = value = il.InteractiveVideoPlayerUtils.protect.builCommentTagsHtml(null);
			expect(value).toEqual(expec);
		});
	});
	describe("Utils Test Cases", function () {
		beforeEach(function () {
			comments = [];
			stopPoints = [];
			called = false;
			InteractiveVideo = {};
			callHelper = {
				play: function () {
					called = true;
				},
				pause: function () {
					called = true;
				}
			};
			spyOn(callHelper, 'play');
			spyOn(callHelper, 'pause');

		});

		afterEach(function () {
		});

		it("sliceCommentAndStopPointsInCorrectPosition", function () {
			var expec = [{comment_time: 5}];
			il.InteractiveVideoPlayerUtils.sliceCommentAndStopPointsInCorrectPosition({comment_time: 5}, 5);
			expect(comments).toEqual(expec);
			il.InteractiveVideoPlayerUtils.sliceCommentAndStopPointsInCorrectPosition({comment_time: 6}, 6);
			expec = [{comment_time: 5}, {comment_time: 6}];
			expect(comments).toEqual(expec);
			il.InteractiveVideoPlayerUtils.sliceCommentAndStopPointsInCorrectPosition({comment_time: 0}, 0);
			expec = [{comment_time: 5}, {comment_time: 0}, {comment_time: 6}];
			expect(comments).toEqual(expec);
		});

		it("replaceCommentsAfterSeeking", function () {
			var expec = '';
			loadFixtures('InteractiveVideoPlayerUtils_fixtures.html');
			il.InteractiveVideoPlayerUtils.replaceCommentsAfterSeeking(1);
			expect($("#ul_scroll").html()).toEqual(expec);
			expec = '<li class="list_item_undefined"><time class="time"> <a onclick="il.InteractiveVideoPlayerUtils.jumpToTimeInVideo(1); return false;">undefined</a></time><span class="comment_username"> [undefined]</span> <span class="comment_title">undefined</span> <span class="comment_text">Text</span> <span class="private_text"></span> <br><div class="comment_tags"></div></li>';
			comments = [{comment_time: 1, comment_text: 'Text', is_interactive: 0, comment_tags: null}];
			il.InteractiveVideoPlayerUtils.replaceCommentsAfterSeeking(5);
			expect($("#ul_scroll").html()).toEqual(expec);
			expec = '';
			comments = [{comment_time: 5, comment_text: 'Text', is_interactive: 1, comment_tags: null}];
			il.InteractiveVideoPlayerUtils.replaceCommentsAfterSeeking(1);
			expect('').toEqual(expec);
		});

		describe("Utils Test Calling Cases", function () {
			beforeEach(function () {
				loadFixtures('InteractiveVideoPlayerUtils_fixtures.html');
				comments = [];
				stopPoints = [];
				called = false;
				InteractiveVideo = {auto_resume: true,};
				callHelper = {
					play: function () {
						called = true;
					},
					pause: function () {
						called = true;
					},
					setCurrentTime: function () {
						called = true;
					}
				};
				spyOn(callHelper, 'play');
				spyOn(callHelper, 'pause');
				spyOn(callHelper, 'setCurrentTime');
				$('#ilInteractiveVideo')[0].play = function () {
					callHelper.play();
				};
				$('#ilInteractiveVideo')[0].pause = function () {
					callHelper.pause();
				};
				$('#ilInteractiveVideo')[0].setCurrentTime = function () {
					callHelper.setCurrentTime();
				};
			});

			afterEach(function () {
			});

			it("resumeVideo true", function () {
				expect(callHelper.play).not.toHaveBeenCalled();
				il.InteractiveVideoPlayerUtils.resumeVideo();
				expect(callHelper.play).toHaveBeenCalled();
			});

			it("resumeVideo false", function () {
				InteractiveVideo.auto_resume = false;
				expect(callHelper.play).not.toHaveBeenCalled();
				il.InteractiveVideoPlayerUtils.resumeVideo();
				expect(callHelper.play).not.toHaveBeenCalled();
			});

			it("jumpToTimeInVideo", function () {
				expect(callHelper.play).not.toHaveBeenCalled();
				il.InteractiveVideoPlayerUtils.jumpToTimeInVideo(2);
				expect(callHelper.play).toHaveBeenCalled();
				expect(callHelper.setCurrentTime).toHaveBeenCalled();
			});
			it("jumpToTimeInVideo", function () {
				expect(callHelper.setCurrentTime).not.toHaveBeenCalled();
				il.InteractiveVideoPlayerUtils.jumpToTimeInVideo(null);
				expect(callHelper.setCurrentTime).not.toHaveBeenCalled();
			});
		});
	});

});