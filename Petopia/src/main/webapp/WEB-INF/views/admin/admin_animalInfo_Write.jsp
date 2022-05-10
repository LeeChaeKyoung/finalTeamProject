<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script src="//cdn.ckeditor.com/4.17.2/standard/ckeditor.js"></script>

<script>
$(function(){
	CKEDITOR.replace("content",{
		width :'100%',
		allowedContent:true,
		toolbar :[['NewPage','Preview','Bold','Italic','Underline','Strike','-','Subscript','Superscript','-','-',
		'JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','Outdent','Indent','HorizontalRule','Link','Unlink','-',
		'Find','Replace','SelectAll','Image','Flash','Table','SpecialChar'],
		'/',['Styles','Format','Font','FontSize','Undo','Redo'],['TextColor','BGColor'],['Cut','Copy','Paste','PasteText'],['Source']],
		enterMode:CKEDITOR.ENTER_BR
	});
	
	CKEDITOR.replace("distinction",{
		width :'100%',	
		allowedContent:true,
		toolbar :[['NewPage','Preview','Bold','Italic','Underline','Strike','-','Subscript','Superscript','-','-',
		'JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','Outdent','Indent','HorizontalRule','Link','Unlink','-',
		'Find','Replace','SelectAll','Image','Flash','Table','SpecialChar'],
		'/',['Styles','Format','Font','FontSize','Undo','Redo'],['TextColor','BGColor'],['Cut','Copy','Paste','PasteText'],['Source']],
		enterMode:CKEDITOR.ENTER_BR
	});
	
	CKEDITOR.replace("disease",{
		width :'100%',	
		allowedContent:true,
		toolbar :[['NewPage','Preview','Bold','Italic','Underline','Strike','-','Subscript','Superscript','-','-',
		'JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','Outdent','Indent','HorizontalRule','Link','Unlink','-',
		'Find','Replace','SelectAll','Image','Flash','Table','SpecialChar'],
		'/',['Styles','Format','Font','FontSize','Undo','Redo'],['TextColor','BGColor'],['Cut','Copy','Paste','PasteText'],['Source']],
		enterMode:CKEDITOR.ENTER_BR
	});
	
	
	$('#filename1').change(function() {//이미지 첨부되면 실행
		
		setImage(this, '#preview1');
	});
	function setImage(input, preview1) {
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = function(e) {
				$(preview1).attr('src', e.target.result);
			}
			reader.readAsDataURL(input.files[0]);
		}
	};
	
	$('#filename2').change(function() {//이미지 첨부되면 실행
		
		setImage(this, '#preview2');
	});
	function setImage(input, preview2) {
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = function(e) {
				$(preview2).attr('src', e.target.result);
			}
			reader.readAsDataURL(input.files[0]);
		}
	};
	
	$('#filename3').change(function() {//이미지 첨부되면 실행
		
		setImage(this, '#preview3');
	});
	function setImage(input, preview3) {
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = function(e) {
				$(preview3).attr('src', e.target.result);
			}
			reader.readAsDataURL(input.files[0]);
		}
	};
	
	
});

</script>
<style>
	.container{
		height: auto;
		overflow:hidden;
	}
	.tab_title{
		float: left;
		width: 19%; 
	}
	.tab_content{
	 	float: right;
		width: 79%;
	}
	.bar{
		float:left;
		width:100%;
		height:60px;
		border:1px solid;
		margin-top: 30px;
		background-color: rgba(0,0,0,0.1);
		margin-bottom: 30px;
	}
	.icon{
		float:left;
		width:50px;
		height:50px;
		
		position: absolute;
		right:100px;
		padding-top: 4px;
	}
	.barcontent{
		position:relative;
		top:10px;
		margin-left:20px;
		font-size: 1.5em;
	}
	.bar_submit{
		float:left;
		width:100%;
		height:60px;
		margin-top: 30px;
		margin-bottom: 30px;
		text-align: center;
	}
	#submitBtn{
		width: 240px;
		background: #FF7900;
		border: #FF7900;
		height: 46px;
		line-height: 44px;
		font-size: 16px;
		font-weight: 700;
		color: #fff;
		margin-left: 5px;
	}
	#resetBtn{
		width: 240px;
		background: gray;
		border: #FF7900;
		height: 46px;
		line-height: 44px;
		font-size: 16px;
		font-weight: 700;
		color: #fff;
		margin-right: 5px;
	}
</style>
<div class="container">
	<ul class="tab_title">
		<li>공지사항관리</li>
		<li>회원관리</li>
		<li>정보공유 게시판 관리</li>
		<li>나눔 게시판 관리</li>
		<li>자랑 게시판 관리</li>
		<li>입양 게시판 관리</li>
		<li>산책 게시판 관리</li>
		<li><a href="/admin/admin_animalInfo">반려동물 정보 관리</a></li>
	</ul>
	
	<div class="tab_content">
		<div style="float:right;">반려동물 정보 관리 - 글쓰기</div><br/><br/>
		<form style="width:100%;" method="post" action="${url}/admin/animalInfoWriteOk" enctype="multipart/form-data">
			<div>
				
			</div><br/>
			
			<div id="imgDiv1" style="width:35%; float:left; ">
				<img src='${url}/img/Logo.png' id="preview1" class="img-thumbnail"/>
				<input type="file" class="form-control-file border" name="imgName" id="filename1" accept="image/jpeg,image/png,image/bmp,image/tiff,image/gif"/>
			</div>
			<div id="contentDiv" style="width:63%;float:right;">
				<span>category</span>
				<select name='category' id='category'>
					<option value=''>선택</option>
					<option>강아지</option>
					<option>고양이</option>
					<option>파충류,양서류</option>
					<option>조류</option>
					<option>기타</option>
				</select>
				<span>breed</span>
				<input style="margin-bottom:10px;" type="text" name="breed" id="breed"/>
				<textarea name="content" id="content"></textarea>
			</div>
			
			<div class="bar">
				<div class="d1">
					<span class="barcontent">특징</span>
				</div>				
			</div>
			
			<div id="contentDiv" style="width:63%;float:left;">
				<textarea name="distinction" id="distinction"></textarea>
			</div>
			<div id="imgDiv1" style="width:35%; float:right;">
				<img src='${url}/img/Logo.png' id="preview2" class="img-thumbnail"/>
				<input type="file" class="form-control-file border" name="imgName" id="filename2" accept="image/jpeg,image/png,image/bmp,image/tiff,image/gif"/>
			</div>
			
			<div class="bar">
				<div>
					<span class="barcontent">질병정보</span>
				</div>
			</div>
			
			<div id="contentDiv" style="width:63%;float:left;">
				<textarea name="disease" id="disease"></textarea>
			</div>
			<div id="imgDiv1" style="width:35%; float:right;">
				<img src='${url}/img/Logo.png' id="preview3" class="img-thumbnail"/>
				<input type="file" class="form-control-file border" name="imgName" id="filename3" accept="image/jpeg,image/png,image/bmp,image/tiff,image/gif"/>
			</div>
			
			<div class="bar_submit">
				<input type="reset" id="resetBtn" value="취소"></input>
				<input type="submit" id="submitBtn" value="등록"/>
			</div>
			
		</form>
		
	</div>

</div>