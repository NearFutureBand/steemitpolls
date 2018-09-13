/* ------------------------------- */
//	extended js for main service	//
// 		https://golospolls.com/		//
/* ------------------------------- */
/*golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');
golos.config.set('websocket', 'wss://ws.testnet.golos.io');*/

var inputsC = 0,
	newPostTimout; // inputs counter
initLang('en'); // lang init = en
if (hash != '') {
	getHash(function (resultContent) {
		insertHtmlPoll(resultContent);
		if (document.querySelector('.lding')) document.querySelector('.lding').style.display = 'none';
		if (location.hash == '') clearUpdTimer();
	});
	if (document.querySelector('.lding')) document.querySelector('.lding').style.display = 'none';
}

window.onhashchange = function () {
	hash = location.hash.substring(1);
	console.log('hash has been changed: ', hash);
	if (hash != '') getHash(function (resultContent) {
		insertHtmlPoll(resultContent);
	});
}

document.onreadystatechange = function () { // loading animation switch-off
	console.log('<f> doc ready');
	if (document.readyState === "complete") {
		addInactiveInput();
		addPollingInputs();
		addPollingInputs(); // add 2nd active field in a polling form
		document.querySelector('.lding').style.display = 'none';
		// temporary autofill
		document.querySelector('.title').value = Date.now() + '- Hello world!';
		document.querySelector('#pollDescriptionInput').value = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dapibus dictum facilisis. Nunc suscipit nisi vel sapien auctor, ac sodales augue iaculis. Suspendisse vel felis in erat dignissim efficitur non eu metus. Morbi a odio sed ligula cursus sollicitudin.';
		document.querySelector('#inputOption1').value = 'Option number one';
		document.querySelector('#inputOption2').value = 'Second option';
		document.querySelector('.footer').scrollIntoView();
		// end autofill
		// variable in valid format moment.js
		switch (localStorage.lang) {
			case 'ua':
				currentLang = 'uk';
				break;
			case 'by':
				currentLang = 'be';
				break;
			case 'cn':
				currentLang = 'zh-cn';
				break;
			case 'kr':
				currentLang = 'ko';
				break;
			case 'jp':
				currentLang = 'ja';
				break;
			default:
				currentLang = localStorage.lang;
				moment.locale(currentLang);
		}
	}
}

function insertHtmlPoll(resultContent) {
	console.log('<f> insertHtmlPoll ');
	document.querySelector('.card-body.text-dark').innerHTML = '';
	if (username) {
		document.querySelector('#complete-form .card-header').innerHTML = document.querySelectorAll('.translate-phrases li')[0].innerHTML + ' @' + username;
	} else {
		document.querySelector('#complete-form .card-header').innerHTML = document.querySelectorAll('.translate-phrases li')[0].innerHTML
	}
	var $div = document.createElement('h5'); // inserting header in poll
	$div.className = 'card-title';
	$div.innerHTML = resultContent.json_metadata.data.poll_title + ' (by @' + resultContent.author + ')';
	if (resultContent.json_metadata.data.title_image) {
		$div.innerHTML = $div.innerHTML + '<p><br><img src="' + resultContent.json_metadata.data.title_image + '" class="img-thumbnail mx-auto d-block mainmage">';
	}
	if (resultContent.json_metadata.data.poll_description) $div.innerHTML = $div.innerHTML + '<br><label class="">' + resultContent.json_metadata.data.poll_description + '</label>';
	document.querySelector('.card-body.text-dark').appendChild($div);

	getVote(function () {
		for (var cnt = 0; resultContent.json_metadata.data.poll_answers.length > cnt; cnt++) { // inserting progress 
			var $div = document.createElement('div');
			$div.className = 'progress-block';
			if (resultContent.json_metadata && resultContent.json_metadata.data && resultContent.json_metadata.data.poll_answers && resultContent.json_metadata.data.poll_images && resultContent.json_metadata.data.poll_answers[cnt] && resultContent.json_metadata.data.poll_images[cnt]) {
				$div.innerHTML = `<div class="card" id="` + cnt + `"><div class="card-body vote-item">
<label class="card-text">` + resultContent.json_metadata.data.poll_answers[cnt] + `</label>
						<p><img src="` + resultContent.json_metadata.data.poll_images[cnt] + `" class="rounded"><div class="progress"  style="cursor: pointer;"><div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0</div></div></div></div><br>`;
				document.querySelector('.card-body.text-dark').appendChild($div);
				document.getElementById(cnt).onclick = progress_click; // dummy for polling
			} else {
				$div.innerHTML = `<div class="card" id="` + cnt + `"><div class="card-body vote-item"><label class="card-text">` + resultContent.json_metadata.data.poll_answers[cnt] + `</label><div class="progress" style="cursor: pointer;"><div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0</div></div></div></div><br>`;
				document.querySelector('.card-body.text-dark').appendChild($div);
				document.getElementById(cnt).onclick = progress_click; // dummy for polling
			}
		}
	});

	document.getElementById('complete-form').style.display = 'block';
	document.getElementById('share-form').style.display = 'block';
	document.getElementById('PollConstructor').style.display = 'none';
	document.getElementById('complete-form').scrollIntoView();
	document.querySelector('#cplkint').value = 'https://golospolls.com/#' + resultContent.author + '/' + resultContent.permlink;
	document.querySelector('#cpcdint').value = `<!-- Put this script tag to the <head> of your page --> <script src="https://golospolls.com/inject.js"></script><!-- Put this div and script tags to the place, where the Poll block will be --> <div class="gPolls"></div><script type="text/javascript">var gPollsWidth = '300', gPollsLink = '` + resultContent.author + `/` + resultContent.permlink + `';</script>`;
	startUpdProgTimer(3500);
	// inserting social buttons
	var $div = document.createElement('div');
	$div.innerHTML = `<a class="btn share-fb" href="https://www.facebook.com/sharer/sharer.php?kid_directed_site=0&u=https%3A%2F%2Fgolospolls.com%2F#` + resultContent.author + `%2F` + resultContent.permlink + `&display=popup&ref=plugin&src=share_button" role="button" target="_blank" onclick="window.open(this.href,this.target,'width=500,height=600,scrollbars=1');return false;"><span class="icon-facebook2"> Share</span></a>
<a class="btn btn-info share-tw" href="https://twitter.com/intent/tweet?ref_src=twsrc%5Etfw&text=Attention%20friends!%20I%27m%20interested%20in%20your%20opinion%20on%20one%20issue%20-%20please%20choose%20the%20option%20that%20you%20think%20is%20correct%20http%3A%2F%2Fgolospolls.com&tw_p=tweetbutton&url=https%3A%2F%2Fgolospolls.com%2F#` + resultContent.author + `%2F` + resultContent.permlink + `" role="button" target="_blank" onclick="window.open(this.href,this.target,'width=500,height=600,scrollbars=1');return false;"><span class="icon-twitter"> Tweet</span></a>
<a class="btn share-vk" href="https://vk.com/share.php?url=https%3A%2F%2Fgolospolls.com%2F#` + resultContent.author + `%2F` + resultContent.permlink + `" role="button" target="_blank" onclick="window.open(this.href,this.target,'width=500,height=600,scrollbars=1');return false;"><img src="graphics/vk-logo.png" width="20" height="13" class="d-inline-block align-top"><span>Поделиться</span></a>
<a class="btn share-gp" href="https://plus.google.com/share?app=110&url=https%3A%2F%2Fgolospolls.com%2F#` + resultContent.author + `%2F` + resultContent.permlink + `" role="button" target="_blank" onclick="window.open(this.href,this.target,'width=500,height=600,scrollbars=1');return false;"><span class="icon-google-plus"> Share</span></a>
<a class="btn share-golos" role="button" onclick="reblogGolos();return false;"><span></span>Reblog</a>`;
	document.querySelector('.socialButtons').innerHTML = '';
	document.querySelector('.socialButtons').appendChild($div);
}

function CopyLinkToClipboard() {
	document.querySelector('#cplkint').select();
	document.execCommand('copy');
	swal({
		type: 'success',
		toast: true,
		title: document.querySelectorAll('.translate-phrases li')[10].innerHTML,
		showConfirmButton: false,
		timer: 2000
	})
}
document.querySelector('#cplkbtn').addEventListener('click', CopyLinkToClipboard, false);

function CopyCodeToClipboard() {
	document.querySelector('#cpcdint').select();
	document.execCommand('copy');
	swal({
		type: 'success',
		toast: true,
		title: document.querySelectorAll('.translate-phrases li')[11].innerHTML,
		showConfirmButton: false,
		timer: 2000
	})
}
document.querySelector('#cpcdbtn').addEventListener('click', CopyCodeToClipboard, false);

function addPollingInputs() { // adding a response option
	document.getElementById('pOptionButt' + inputsC).removeAttribute('disabled');
	document.getElementById('addImg' + inputsC).removeAttribute('disabled');
	document.getElementById('pOption' + inputsC).style.opacity = '1';
	document.getElementById('inputOption' + inputsC).setAttribute('placeholder', document.querySelectorAll('.translate-phrases li')[6].innerHTML);
	document.querySelector('.card-body').getElementsByClassName('form-control')[0].setAttribute('placeholder', document.querySelectorAll('.translate-phrases li')[6].innerHTML);
	document.querySelector('#inputOption' + inputsC).removeEventListener('focus', addPollingInputs, false);
	addInactiveInput();
}

function addInactiveInput() {
	inputsC++;
	var $div = document.createElement('div');
	$div.className = 'input-group mb-3';
	$div.id = 'pOption' + inputsC;
	$div.style = 'opacity: 0.4;';
	$div.innerHTML = `<div class="input-group-prepend">
<img id="load-img` + inputsC + `" src="graphics/loading.gif" width="35" height="35" style="display: none; margin: 0 5px;"><div class="remImg" onclick="remImg(this)"><span class="icon-cross"></span></div><button class="btn btn-secondary" type="button" onClick="ipfsImgLoad(this)" id="addImg` + inputsC + `" disabled><span class="icon-image"></span></button></div><input type="text" class="form-control" placeholder="` + document.querySelectorAll('.translate-phrases li')[12].innerHTML + `" aria-label="Get a link of your poll" aria-describedby="basic-addon2" id="inputOption` + inputsC + `" data-toggle="tooltip" data-placement="left"  onchange="checkInput(this.id);"><div class="input-group-append"><button class="btn btn-danger" type="button" id="pOptionButt` + inputsC + `" disabled><span class="icon-cross"></span></button></div></div><div class="invalid-feedback">Please fill or remove empty fields</div>`;
	$div.querySelector('#inputOption' + inputsC).addEventListener('focus', addPollingInputs, false);
	$div.querySelector('.btn.btn-danger').addEventListener('click', function (e) { // del button event
		if (e.target.tagName == 'BUTTON') {
			e.target.parentNode.parentNode.remove();
		} else if (e.target.tagName == 'SPAN') {
			e.target.parentNode.parentNode.parentNode.remove();
		}
	}, false);
	document.getElementById('PollForm').appendChild($div);
}

function completeForm(callback) {
	console.log('<f> completeForm');
	// collecting data & sending 
	var $pollInputs = document.getElementById('PollForm').getElementsByClassName('form-control'),
		$pollImages = document.getElementById('PollForm').getElementsByTagName('img'),
		pollDescription = document.getElementById('pollDescriptionInput').value,
		errTrigger,
		answers = [],
		answerimages = [];
	if ($pollInputs.length < 3) {
		swal({
			type: 'error',
			title: document.querySelectorAll('.translate-phrases li')[15].innerHTML,
			text: document.querySelectorAll('.translate-phrases li')[26].innerHTML
		});
		return;
	}
	for (var cnt = 0; $pollInputs.length - 1 > cnt; cnt++) {
		if ($pollInputs[cnt].value == '') {
			$pollInputs[cnt].setAttribute('class', 'form-control title is-invalid');
			errTrigger = true;
		} else {
			$pollInputs[cnt].setAttribute('class', 'form-control title');
			answers[cnt] = $pollInputs[cnt].value;
			if ($pollImages[cnt].src.replace(/^.*[\\\/]/, '') == 'img.svg' || $pollImages[cnt].src.replace(/^.*[\\\/]/, '') == 'loading.gif' || $pollImages[cnt].src.replace(/^.*[\\\/]/, '') == 'err.png' || $pollImages[cnt].src.replace(/^.*[\\\/]/, '') == 'index.html' || $pollImages[cnt].src == 'https://golospolls.com/') {
				answerimages[cnt] = '';
			} else {
				answerimages[cnt] = $pollImages[cnt].src;
			}
		}
	}
	if (errTrigger) return;
	str = urlLit(document.querySelector('.form-control.title').value, 0);
	//str.replace(/[^\w\d]/g, '_');
	str = str + '-' + Date.now();
	var title = document.querySelector('.form-control.title').value,
		title_pic;
	if (document.querySelector('#load-img0').src.replace(/^.*[\\\/]/, '') == 'img.svg' || document.querySelector('#load-img0').src.replace(/^.*[\\\/]/, '') == 'loading.gif' || document.querySelector('#load-img0').src.replace(/^.*[\\\/]/, '') == 'err.png' || document.querySelector('#load-img0').src.replace(/^.*[\\\/]/, '') == 'index.html' || document.querySelector('#load-img0').src == 'https://golospolls.com/') {
		title_pic = '';
	} else {
		title_pic = document.querySelector('#load-img0').src;
	}
	var jsonMetadata = {
		app: 'golospolls/0.1',
		canonical: 'https://golospolls.com/#' + username + '/' + str,
		app_account: 'golosapps',
		data: {
			poll_title: title,
			title_image: title_pic,
			poll_images: answerimages,
			poll_answers: answers,
			poll_description: pollDescription
		}
	};
	document.querySelector('.lding').style.display = 'block';
	console.log('permlink : ' + str);
	console.log('json var : ' + answers); // debug info
	console.log('title : ' + title);
	console.log('json answerimages : ' + answerimages);
	send_request(str, title, jsonMetadata);
}

function checkInput(id) {
	document.getElementById(id).removeAttribute('value');
	if (document.getElementById(id).value == '') {
		document.getElementById(id).setAttribute('class', 'form-control title is-invalid');
	} else {
		document.getElementById(id).setAttribute('class', 'form-control title');
	}
	console.log('value: ', document.getElementById(id).value);
}

function send_request(str, title, jsonMetadata, callback) {
	console.log('<f> send_request');
	var parentAuthor = ''; // for post creating, empty field
	var parentPermlink = 'test'; // main tag
	var body = 'test';
	golos.broadcast.comment(wif.posting, parentAuthor, parentPermlink, username, str, title, body, jsonMetadata, function (err, result) {
		if (!err) {
			window.location.hash = username + '/' + str;
			tagNewPost = true;
			clearTimeout(newPostTimout);
			counter = 24;
			newPostTimout = setInterval(function () {
				counter--;
				console.log('counter =', counter);
				if (counter == 0) {
					clearTimeout(newPostTimout);
					tagNewPost = false;
				}
			}, 1000);
		} else {
			clearTimeout(newPostTimout);
			swal({
				type: 'error',
				title: document.querySelectorAll('.translate-phrases li')[15].innerHTML,
				text: humaNize(err)
			});
		}
		document.querySelector('.lding').style.display = 'none';
		if (callback) callback(err, result);
	}); // add post
}

function getMyPolls(callback) {
	console.log('<f>my-polls click');
	clearUpdTimer();
	document.querySelector('.lding').style.display = 'block';
	document.querySelector('.rem-vote').style.display = 'none';
	document.querySelector('.edit-poll').style.display = 'none';
	location.hash = '';
	document.querySelector('.card-header-right p').innerHTML = '';
	document.getElementById('complete-form').style.display = 'block';
	document.getElementById('PollConstructor').style.display = 'none';
	var countofvotes = 0,
		cnt = 0,
		countofposts = 0,
		winner = 0,
		max = 0;
	var query = {
		select_authors: [username],
		filter_tags: ['test'],
		limit: 100
	};
	golos.api.getDiscussionsByBlog(query, function (err, result) {
		console.log('<f>getDiscussionsByBlog ', query);
		/*console.log(result);*/
		if (result == '') {
			var $div = document.createElement('tr');
			$div.innerHTML = `<td colspan="6">` + document.querySelectorAll('.translate-phrases li')[8].innerHTML + `</td>`;
			document.querySelector('.myPollTab').appendChild($div);
			document.querySelector('.lding').style.display = 'none';
		}
		if (!err) {
			document.querySelector('#complete-form .card-header').innerHTML = document.querySelectorAll('.translate-phrases li')[20].innerHTML;
			result.forEach(function (item) {
				golos.api.getContentReplies(item.author, item.permlink, 10000, function (err, result) {
					if (!err) {
						pollData = {};
						countofvotes = 0;
						voters = [];
						max = 0;
						winner = 0;
						item.json_metadata = JSON.parse(item.json_metadata); //parse json to js
						result.forEach(function (result) {
							result.json_metadata = JSON.parse(result.json_metadata);
							if (typeof result.json_metadata.data != 'undefined' && typeof result.json_metadata.data.poll_id != 'undefined') {
								if (!~voters.indexOf('"' + result.author + '",')) {
									voters = voters + '"' + result.author + '",';
									countofvotes++;
								}
								cnt++;
								if (!pollData[result.json_metadata.data.poll_id]) pollData[result.json_metadata.data.poll_id] = {
									count: 0,
								};
								pollData[result.json_metadata.data.poll_id].count++;
								if (max < pollData[result.json_metadata.data.poll_id].count) {
									max = pollData[result.json_metadata.data.poll_id].count;
									winner = item.json_metadata.data.poll_answers[result.json_metadata.data.poll_id];
								}
								if (max == 0)
									winner = document.querySelectorAll('.translate-phrases li')[6].innerHTML;
							}
						});
						if (typeof item.json_metadata.data != 'undefined' && typeof item.json_metadata.data.poll_title != 'undefined') {
							countofposts++;
							let i = 0,
								answerSrt = '';
							item.json_metadata.data.poll_answers.forEach(function (poll_answers) { // poll answers converting
								answerSrt = answerSrt + item.json_metadata.data.poll_answers[i] + '; ';
								i++;
							});
							var $div = document.createElement('tr');
							$div.innerHTML = `<td>` + countofposts + `. <a href="#` + item.author + `/` + item.permlink + `">` + item.json_metadata.data.poll_title + `</a></td>
                                      <td>` + moment(item.created).format('lll') + `</td>
                                      <td>` + answerSrt + `</td>
                                      <td>` + countofvotes + `</td>
                                      <td>` + winner + `</td>
                                    </tr>`;
							document.querySelector('.myPollTab').appendChild($div);
						}
						document.querySelector('.lding').style.display = 'none';
					}
				});
			});
		} else {
			swal({
				type: 'error',
				title: document.querySelectorAll('.translate-phrases li')[15].innerHTML,
				text: humaNize(err)
			});
			document.querySelector('.lding').style.display = 'none';
		}
		if (callback) callback(err, result);
	});
	var $div = document.createElement('table');
	$div.className = 'table table-striped';
	$div.innerHTML = `<thead>
                            <tr>
                              <th scope="col">` + document.querySelectorAll('.translate-phrases li')[3].innerHTML + `</th>
                              <th scope="col">` + document.querySelectorAll('.translate-phrases li')[1].innerHTML + `</th>
                              <th scope="col">` + document.querySelectorAll('.translate-phrases li')[2].innerHTML + `</th>
                              <th scope="col">` + document.querySelectorAll('.translate-phrases li')[4].innerHTML + `</th>
                              <th scope="col">` + document.querySelectorAll('.translate-phrases li')[5].innerHTML + `</th>
                            </tr>
                          </thead>
                          <tbody class="myPollTab">
                          </tbody>
                        </table>`
	document.querySelector('.card-body.text-dark').innerHTML = '';
	document.querySelector('.card-body.text-dark').appendChild($div);
}

function urlLit(w, v) { // cyrilic-to-translit-function
	var tr = 'a b v g d e ["zh","j"] z i y k l m n o p r s t u f h c ch sh ["shh","shch"] ~ y ~ e yu ya ~ ["jo","e"]'.split(' ');
	var ww = '';
	w = w.toLowerCase();
	for (i = 0; i < w.length; ++i) {
		cc = w.charCodeAt(i);
		ch = (cc >= 1072 ? tr[cc - 1072] : w[i]);
		if (ch.length < 3) ww += ch;
		else ww += eval(ch)[v];
	}
	return (ww.replace(/[^a-zA-Z0-9\-]/g, '-').replace(/[-]{2,}/gim, '-').replace(/^\-+/g, '').replace(/\-+$/g, ''));
}

function reblogGolos() {
	console.log('=> reblog click');
	const json = JSON.stringify(['reblog', {
		account: username,
		author: resultContent.author,
		permlink: resultContent.permlink
}]);
	auth(function () {
		golos.broadcast.customJson(wif.posting, [], [username], 'follow', json, (err, result) => {
			console.log('username', username, 'author', resultContent.author, 'permlink', resultContent.permlink);
			if (err) {
				swal({
					type: 'error',
					title: document.querySelectorAll('.translate-phrases li')[15].innerHTML,
					text: humaNize(err)
				});
			} else {
				swal({
					type: 'success',
					toast: true,
					title: document.querySelectorAll('.translate-phrases li')[21].innerHTML,
					showConfirmButton: false,
					timer: 2000
				})
			}
			console.log(result);
		});
	}, ['posting']);
};

function ipfsImgLoad(e) {
	console.log('<f> ipfsImgLoad(e) ', e.id);
	e.parentNode.querySelector('img').src = 'graphics/loading.gif';
	uploadImageToIpfs(e.parentNode.querySelector('img').id, (err, files) => {
		if (err) {
			swal({
				type: 'error',
				title: document.querySelectorAll('.translate-phrases li')[15].innerHTML,
				text: humaNize(err)
				});
			e.parentNode.querySelector('img').src = 'graphics/err.png';
		} else {
			console.log(files[0][0].path + files[0][0].hash);
			e.parentNode.querySelectorAll('img').forEach(function (result) {
				result.src = files[0][0].path + files[0][0].hash;
			});
		}
	});
};

// buttons events 

function newPoll() {
	document.querySelector('#PollConstructor').style.display = 'block';
	document.querySelector('#complete-form').style.display = 'none';
}

document.getElementById('complete').addEventListener('click', function () {
	console.log('<f> complete button');
	if (document.querySelector('.form-control.title').value == '') {
		swal({
			title: document.querySelectorAll('.translate-phrases li')[15].innerHTML,
			text: document.querySelectorAll('.translate-phrases li')[18].innerHTML,
			type: 'error'
		})
	} else {
		if (wif.posting) { // if already authorized
			completeForm();
		} else {
			auth(function () {
				completeForm(function (err, result) {
					if (err) {
						swal({
							type: 'error',
							title: document.querySelectorAll('.translate-phrases li')[15].innerHTML,
							text: humaNize(err)
						});
					}
				});
			}, ['posting']);
			document.querySelector('.lding').style.display = 'none'; // loader off
		}
	}
}, false);

document.querySelector('.edit-poll').addEventListener('click', () => {
	var pollHTML = '',
		$imageEdit = '';
	for (var cnt = 0; resultContent.json_metadata.data.poll_answers.length > cnt; cnt++) {
		if (resultContent.json_metadata.data.poll_images[cnt]) {
			$imageEdit = '';
		} else {
			$imageEdit = 'style="display: none;"';
		}
		pollHTML = pollHTML + `<div class="input-group mb-3" id="option` + cnt + `">
<div class="input-group-prepend"><img class="uplded-img-true" id="load-imag` + cnt + `" src="` + resultContent.json_metadata.data.poll_images[cnt] + `" width="35" height="35"` + $imageEdit + `><div class="remImg" onclick="remImg(this)"><span class="icon-cross"></span></div><span class="btn btn-secondary" onClick="ipfsImgLoad(this)"><span class="icon-image"></span></span><input type="text" class="form-control" value="` + resultContent.json_metadata.data.poll_answers[cnt] + `" placeholder="Fill in this field" id="input` + cnt + `" data-placement="left"  onchange="checkInput(this.id);"><div class="input-group-append"><button class="btn btn-danger remVar" type="button"><span class="icon-cross"></span></button></div><div class="invalid-feedback">Please fill or remove empty field</div></div>
<div class="invalid-feedback">Please fill or remove empty fields
</div></div>`;
	}
	auth(function () {
		if (resultContent.json_metadata.data.title_image) {
			$imageEdit = '';
		} else {
			$imageEdit = 'style="display: none;"';
		}
		console.log(resultContent.json_metadata.data.title_image);
		swal({
			html: `<div class="form-group-swal">
							<label>` + document.querySelectorAll('.translate-phrases li')[23].innerHTML + `</label>
							<input type="text" class="form-control title edit" value="` + resultContent.json_metadata.data.poll_title + `" placeholder="Type your text here" onchange="checkInput(this.id);">
							<label for="exampleFormControlTextarea1">` + document.querySelectorAll('.translate-phrases li')[24].innerHTML + `</label>
							<textarea class="form-control" id="pollDescriptionInput" rows="3" maxlength="300">` + resultContent.json_metadata.data.poll_description + `</textarea>
							<br><img class="uplded-img-true" id="load-imag" src="` + resultContent.json_metadata.data.title_image + `" width="35" height="35" ` + $imageEdit + ` ><div class="remImg" onclick="remImg(this)"><span class="icon-cross"></span></div><span class="btn btn-secondary" onClick="ipfsImgLoad(this)"><span class="icon-image"></span> Add main image</span>
						<div id="EditPollForm">
							<label>` + document.querySelectorAll('.translate-phrases li')[25].innerHTML + `</label>
						</div>
						</div><div class="varDiv">` + pollHTML + `</div><label class="label-error">At least 2 options should stay</label><span class="btn btn-secondary addvar" onclick="addvar()"><span class="icon-plus"></span></span><button class="btn btn-success apply"><span class="icon-checkmark"></span> Apply</button><button class="btn btn-danger cancel"><span class="icon-cross"></span> Cancel</button>`,
			showCloseButton: true,
			showConfirmButton: false,
			width: 800,
		})
	}, ['posting']);
	document.querySelector('.apply').addEventListener('click', () => {
		var i = 0,
			err,
			answers = [];
		document.querySelectorAll('.varDiv input').forEach(function (item) {
			if (item.value == '') {
				checkInput(item.id);
				console.log('EMPTY ITEM:', item.id);
				err = true;
			}
			answers[i] = item.value;
			i++;
		});
		if (err) {
			console.log('err');
			return;
		}
		i = 0;
		var newPollImages = [];
		document.querySelector('.varDiv').querySelectorAll('.uplded-img-true').forEach(function (item) {
			if (item.src.replace(/^.*[\\\/]/, '') == 'img.svg' || item.src.replace(/^.*[\\\/]/, '') == 'loading.gif' || item.src.replace(/^.*[\\\/]/, '') == 'err.png' || item.src.replace(/^.*[\\\/]/, '') == 'index.html' || item.src.replace(/^.*[\\\/]/, '') == '') {
				newPollImages[i] = '';
			} else {
				newPollImages[i] = item.src;
			}
			i++;
		});
		var $titleImage = document.querySelector('.form-group-swal img').src;
		if ($titleImage.replace(/^.*[\\\/]/, '') == 'img.svg' || $titleImage.replace(/^.*[\\\/]/, '') == 'loading.gif' || $titleImage.replace(/^.*[\\\/]/, '') == 'err.png' || $titleImage.replace(/^.*[\\\/]/, '') == 'index.html' || $titleImage.replace(/^.*[\\\/]/, '') == '') {
			$titleImage = '';
		}
		var jsonMetadata_edit = {
			app: 'golospolls/0.1',
			canonical: 'https://golospolls.com/#' + username + '/' + resultContent.permlink,
			app_account: 'golosapps',
			data: {
				poll_title: document.querySelector('.title.edit').value,
				title_image: $titleImage,
				poll_images: newPollImages,
				poll_answers: answers,
				poll_description: document.querySelector('.form-group-swal textarea').value
			}
		};
		console.log('title_image:', $titleImage);
		console.log('poll_images:', newPollImages);
		if (!err) {
			send_request(resultContent.permlink, document.querySelector('.title.edit').value, jsonMetadata_edit, function () {
				getHash(function (resultContent) {
					insertHtmlPoll(resultContent);
				});
			});
			console.log('newPollImages', newPollImages);
			swal(
				'Success',
				'Your poll has been edited.',
				'success'
			);
		}
	})
	document.querySelector('.cancel').addEventListener('click', () => {
		document.querySelector('.swal2-close').click();
	})
	let i = 0;
	document.querySelectorAll('.remVar').forEach(function (item) {
		document.querySelectorAll('.remVar')[i].addEventListener('click', () => {
			if (document.querySelectorAll('.remVar').length > 2) {
				item.parentNode.parentNode.parentNode.remove();
			} else {
				document.querySelectorAll('.remVar').forEach(function (item) {
					item.setAttribute('title', 'At least 2 options should stay');
				});
				document.querySelector('.swal2-content .label-error').style.display = 'block';
				document.querySelector('.addvar').style = 'margin-right: 96%; margin-top: -55px;'
				return;
			}
		})
		i++;
	});
}, false);

function addvar() {
	var $div = document.createElement('div');
	$div.innerHTML = `<div class="input-group mb-3">
<div class="input-group-prepend"><img class="uplded-img-true" id="load-imag0" src="" width="35" height="35" style="display: none;"><div class="remImg" onclick="remImg(this)"><span class="icon-cross"></span></div><span class="btn btn-secondary" onclick="ipfsImgLoad(this)"><span class="icon-image"></span></span><input type="text" class="form-control" placeholder="Fill in this field" id="` + Date.now() + `" data-placement="left" onchange="checkInput(this.id);"><div class="input-group-append"><button class="btn btn-danger remVar" type="button"><span class="icon-cross"></span></button></div><div class="invalid-feedback">Please fill or remove empty fields</div></div><div class="invalid-feedback">Please fill or remove empty fields</div></div>`;
	$div.querySelector('.remVar').addEventListener('click', () => {
		if (document.querySelectorAll('.remVar').length > 2) {
			$div.remove();
		} else {
			document.querySelectorAll('.remVar').forEach(function (item) {
				$div.setAttribute('title', 'At least 2 options should stay');
			});
			document.querySelector('.swal2-content .label-error').style.display = 'block';
			document.querySelector('.addvar').style = 'margin-right: 96%; margin-top: -55px;'
			return;
		}
	}, false);
	document.querySelector('.varDiv').appendChild($div);
	if (document.querySelectorAll('.remVar').length > 2) {
		document.querySelectorAll('.remVar').forEach(function (item) {
			item.removeAttribute('title');
		});
		document.querySelector('.swal2-content .label-error').style.display = 'none';
		document.querySelector('.addvar').style = 'margin-right: 96%; margin-top: 0;'
	} else {
		document.querySelectorAll('.remVar').forEach(function (item) {
			$div.setAttribute('title', 'At least 2 options should stay');
		});
		document.querySelector('.swal2-content .label-error').style.display = 'block';
		document.querySelector('.addvar').style = 'margin-right: 96%; margin-top: -55px;'
		return;
	}
}

function myPolls() {
	if (wif.posting) { // if already authorized
		getMyPolls();
		document.querySelector('#share-form').style.display = 'none';
	} else {
		auth(function () {
			getMyPolls(function (err, result) {
				if (err) {
					swal({
						type: 'error',
						title: document.querySelectorAll('.translate-phrases li')[15].innerHTML,
						text: humaNize(err)
					});
				}
			});
		}, ['posting']);
		document.querySelector('.lding').style.display = 'none'; // loader off
	}
}

function about() {
	swal({
		title: document.getElementById('about-html-title').innerHTML,
		html: document.getElementById('about-html').innerHTML,
		type: 'info',
		showConfirmButton: false,
		width: 600,
		padding: '1rem',
		showCloseButton: 'true',
		//onClose: DeleteUnsavedImages
	}).then(function () {
		location.hash = '';
   });
}

function integration() {
	console.log('<f> integration click');
	swal({
		title: document.getElementById('integration-html-header').innerHTML,
		html: document.getElementById('integration-html').innerHTML,
		type: 'info',
		showConfirmButton: false,
		width: 600,
		padding: '1rem',
		showCloseButton: 'true'
	});
}

document.querySelector('.navbar-collapse').addEventListener('click', () => { // hides mobilenavs onclick
	document.querySelector('.navbar-collapse').classList.remove('show');
});

function remImg(e) {
	console.log(e);
	e.style.display = 'none';
	e.parentNode.querySelector('img').src = '';
	e.parentNode.querySelector('img').style.display = 'none';
	document.querySelector('#imagesSelector').remove();
}

document.getElementById('support').addEventListener('click', () => {
	swal({
		html: document.getElementById('support-body').innerHTML,
		showCloseButton: true,
		width: 600,
		type: 'question'
	})
});
