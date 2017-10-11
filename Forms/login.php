<html>
 
<head>     
<title>Login Page</title>     
<style type = "text/css">         
body {       
font-family:Arial, Helvetica, sans-serif;            
font-size:14px         
}     
label {            
font-weight:bold;            
width:100px;            
font-size:14px;         
}    
.box {            
border:#666666 solid 1px;         
}    
	input{
		margin: .4em;;
	}
</style>
      
</head>
<body bgcolor = "#FFFFFF">     
<div align = "center">         
<div style = "width:300px; border: solid 1px #333333; " align = "left">           
<div style = "background-color:#abccab; color:#FFFFFF; padding:3px;">
<b>Login</b>
</div>            
<div style="padding: 20px">              
<form action = "login.php" method = "post">                 
<label>UserName  :</label>
<input type = "text" name = "username" class = "box"/> 
<br>           
<label>Password  :</label>
<input type = "password" name = "password" class = "box" />
<br>
<input type="radio" name="userType" value="Individual" id="individual"/> 
<label>Individual</label>
<input type="radio" name="userType" value="Organization" id="individual"/>  
<label>Organization</label>
<br>              
<input type = "submit" value = " Submit "/>            
</form>          
</div>       
</div>   
</div?
</body>
</html>
<?php 
if($_POST){	
if($_POST['username']=="admin" && $_POST['password']=="admin"){		
header("location:welcome.php");	
}else{		
echo "failed";		
}
}
?>