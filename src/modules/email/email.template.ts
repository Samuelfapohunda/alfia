const link = process.env.FRONTEND_URL;

export const getVerificationEmail = (name: string, otp: string) => {
  const body = `<p>Dear ${name},<br>
      <br>
      We are glad to have you onboard.<br>
      <br>
      Please use the OTP below to verify your account with us<br>
      <br>
      The OTP will expire in 10 minutes<br>
    <br>
      <span style="font-size:24px"><strong>${otp}</strong></span><br>
      <br>
      Regards,<br>
      Alfia team</p>`;
  return mainTemplate(body);
};

export const getAccountCreationPinEmail = (name: string, password: number) => {
  const body = `<p>Dear ${name},<br>
    <br>
    We are glad to have you onboard.<br>
    <br>
    Please use the pin below to login or create an account with us.<br>
    <br>
    <span style="font-size:24px"><strong>${password}</strong></span><br>
    <br>
    Regards,<br>
    Alfia Team</p>`;
  return mainTemplate(body);
};

export const sendConfirmationEmail = (name: string) => {
  const body = `<p>Dear ${name},<br>
    <br>
    Your message has been received<br>
    <br>
    Regards,<br>
    Alfia Team</p>`;
  return mainTemplate(body);
};

export const getAdminInvitationEmail = (password: string) => {
  const body = `<p>Hello,<br>
    <br>
    Here's your invitation to join the Alfia admin team<br>
    <br>
    Please use the password below to login<br>
    <br>
    <span style="font-size:24px"><strong>${password}</strong></span><br>
    <br>
	Please note that you will be required to change your password on first login<br>
    <br>
    Regards,<br>
    Alfia Team</p>`;
  return mainTemplate(body);
};

export const getForgotPasswordEmail = (name: string, token: string) => {
  const body = `<p>Dear ${name},<br>
      <br>
      Someone initiated a password reset on your account<br>
      <br>
      Please use the token below to reset your password<br>
      <br>
      <span style="font-size:24px"><strong>${token}</strong></span><br>
      <br>
      Regards,<br>
      Alfia team</p>`;
  return mainTemplate(body);
};

export const getAdminForgotPasswordEmail = (
  name: string,
  newPassword: string,
) => {
  const body = `<p>Dear ${name},<br>
    <br>
    Someone initiated a password reset on your account<br>
    <br>
    Please use the password below to gain access to your account<br>
    <br>
    <span style="font-size:24px"><strong>${newPassword}</strong></span><br>
    <br>
    Regards,<br>
    Alfia Team</p>`;
  return mainTemplate(body);
};

export const getResetPasswordEmail = (name: string) => {
  const body = `<p>Dear ${name},<br>
    <br>
    Your password reset was successful<br>
    <br>
    Regards,<br>
    Alfia Team</p>`;
  return mainTemplate(body);
};

export const getVerificationSuccessfulEmail = (name: string) => {
  const body = `<p>Dear ${name},<br>
    <br>
    Your account has been successfully verified<br>
    <br>
    Regards,<br>
    Alfia Team</p>`;
  return mainTemplate(body);
};

export const getChangePasswordEmail = (name: string) => {
  const body = `<p>Dear ${name},<br>
    <br>
    Your password was changed successful<br>
    <br>
    Regards,<br>
    Alfia Team</p>`;
  return mainTemplate(body);
};

const mainTemplate = (body: string) => {
  return `
	<!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
          <!-- NAME: SELL PRODUCTS -->
          <!--[if gte mso 15]>
          <xml>
              <o:OfficeDocumentSettings>
              <o:AllowPNG/>
              <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
          </xml>
          <![endif]-->
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title></title>
          
      <style type="text/css">
      p{
        margin:10px 0;
        padding:0;
      }
      table{
        border-collapse:collapse;
      }
      h1,h2,h3,h4,h5,h6{
        display:block;
        margin:0;
        padding:0;
      }
      img,a img{
        border:0;
        height:auto;
        outline:none;
        text-decoration:none;
      }
      body,#bodyTable,#bodyCell{
        height:100%;
        margin:0;
        padding:0;
        width:100%;
      }
      .mcnPreviewText{
        display:none !important;
      }
      #outlook a{
        padding:0;
      }
      img{
        -ms-interpolation-mode:bicubic;
      }
      table{
        mso-table-lspace:0pt;
        mso-table-rspace:0pt;
      }
      .ReadMsgBody{
        width:100%;
      }
      .ExternalClass{
        width:100%;
      }
      p,a,li,td,blockquote{
        mso-line-height-rule:exactly;
      }
      a[href^=tel],a[href^=sms]{
        color:inherit;
        cursor:default;
        text-decoration:none;
      }
      p,a,li,td,body,table,blockquote{
        -ms-text-size-adjust:100%;
        -webkit-text-size-adjust:100%;
      }
      .ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{
        line-height:100%;
      }
      a[x-apple-data-detectors]{
        color:inherit !important;
        text-decoration:none !important;
        font-size:inherit !important;
        font-family:inherit !important;
        font-weight:inherit !important;
        line-height:inherit !important;
      }
      .templateContainer{
        max-width:600px !important;
      }
      a.mcnButton{
        display:block;
      }
      .mcnImage,.mcnRetinaImage{
        vertical-align:bottom;
      }
      .mcnTextContent{
        word-break:break-word;
      }
      .mcnTextContent img{
        height:auto !important;
      }
      .mcnDividerBlock{
        table-layout:fixed !important;
      }
    /*
    @tab Page
    @section Heading 1
    @style heading 1
    */
      h1{
        /*@editable*/color:#222222;
        /*@editable*/font-family:Helvetica;
        /*@editable*/font-size:40px;
        /*@editable*/font-style:normal;
        /*@editable*/font-weight:bold;
        /*@editable*/line-height:150%;
        /*@editable*/letter-spacing:normal;
        /*@editable*/text-align:center;
      }
    /*
    @tab Page
    @section Heading 2
    @style heading 2
    */
      h2{
        /*@editable*/color:#222222;
        /*@editable*/font-family:Helvetica;
        /*@editable*/font-size:34px;
        /*@editable*/font-style:normal;
        /*@editable*/font-weight:bold;
        /*@editable*/line-height:150%;
        /*@editable*/letter-spacing:normal;
        /*@editable*/text-align:left;
      }
    /*
    @tab Page
    @section Heading 3
    @style heading 3
    */
      h3{
        /*@editable*/color:#444444;
        /*@editable*/font-family:Helvetica;
        /*@editable*/font-size:22px;
        /*@editable*/font-style:normal;
        /*@editable*/font-weight:bold;
        /*@editable*/line-height:150%;
        /*@editable*/letter-spacing:normal;
        /*@editable*/text-align:left;
      }
    /*
    @tab Page
    @section Heading 4
    @style heading 4
    */
      h4{
        /*@editable*/color:#949494;
        /*@editable*/font-family:Georgia;
        /*@editable*/font-size:20px;
        /*@editable*/font-style:italic;
        /*@editable*/font-weight:normal;
        /*@editable*/line-height:125%;
        /*@editable*/letter-spacing:normal;
        /*@editable*/text-align:left;
      }
    /*
    @tab Header
    @section Header Container Style
    */
      #templateHeader{
        /*@editable*/background-color:#F7F7F7;
        /*@editable*/background-image:none;
        /*@editable*/background-repeat:no-repeat;
        /*@editable*/background-position:center;
        /*@editable*/background-size:cover;
        /*@editable*/border-top:0;
        /*@editable*/border-bottom:0;
        /*@editable*/padding-top:45px;
        /*@editable*/padding-bottom:45px;
      }
    /*
    @tab Header
    @section Header Interior Style
    */
      .headerContainer{
        /*@editable*/background-color:transparent;
        /*@editable*/background-image:none;
        /*@editable*/background-repeat:no-repeat;
        /*@editable*/background-position:center;
        /*@editable*/background-size:cover;
        /*@editable*/border-top:0;
        /*@editable*/border-bottom:0;
        /*@editable*/padding-top:0;
        /*@editable*/padding-bottom:0;
      }
    /*
    @tab Header
    @section Header Text
    */
      .headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{
        /*@editable*/color:#757575;
        /*@editable*/font-family:Helvetica;
        /*@editable*/font-size:16px;
        /*@editable*/line-height:150%;
        /*@editable*/text-align:left;
      }
    /*
    @tab Header
    @section Header Link
    */
      .headerContainer .mcnTextContent a,.headerContainer .mcnTextContent p a{
        /*@editable*/color:#007C89;
        /*@editable*/font-weight:normal;
        /*@editable*/text-decoration:underline;
      }
    /*
    @tab Body
    @section Body Container Style
    */
      #templateBody{
        /*@editable*/background-color:#ffffff;
        /*@editable*/background-image:none;
        /*@editable*/background-repeat:no-repeat;
        /*@editable*/background-position:center;
        /*@editable*/background-size:cover;
        /*@editable*/border-top:0;
        /*@editable*/border-bottom:0;
        /*@editable*/padding-top:36px;
        /*@editable*/padding-bottom:45px;
      }
    /*
    @tab Body
    @section Body Interior Style
    */
      .bodyContainer{
        /*@editable*/background-color:transparent;
        /*@editable*/background-image:none;
        /*@editable*/background-repeat:no-repeat;
        /*@editable*/background-position:center;
        /*@editable*/background-size:cover;
        /*@editable*/border-top:0;
        /*@editable*/border-bottom:0;
        /*@editable*/padding-top:0;
        /*@editable*/padding-bottom:0;
      }
    /*
    @tab Body
    @section Body Text
    */
      .bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{
        /*@editable*/color:#757575;
        /*@editable*/font-family:Helvetica;
        /*@editable*/font-size:16px;
        /*@editable*/line-height:150%;
        /*@editable*/text-align:left;
      }
    /*
    @tab Body
    @section Body Link
    */
      .bodyContainer .mcnTextContent a,.bodyContainer .mcnTextContent p a{
        /*@editable*/color:#007C89;
        /*@editable*/font-weight:normal;
        /*@editable*/text-decoration:underline;
      }
    /*
    @tab Footer
    @section Footer Style
    */
      #templateFooter{
        /*@editable*/background-color:#0e35bd;
        /*@editable*/background-image:none;
        /*@editable*/background-repeat:no-repeat;
        /*@editable*/background-position:center;
        /*@editable*/background-size:cover;
        /*@editable*/border-top:0;
        /*@editable*/border-bottom:0;
        /*@editable*/padding-top:45px;
        /*@editable*/padding-bottom:63px;
      }
    /*
    @tab Footer
    @section Footer Interior Style
    */
      .footerContainer{
        /*@editable*/background-color:transparent;
        /*@editable*/background-image:none;
        /*@editable*/background-repeat:no-repeat;
        /*@editable*/background-position:center;
        /*@editable*/background-size:cover;
        /*@editable*/border-top:0;
        /*@editable*/border-bottom:0;
        /*@editable*/padding-top:0;
        /*@editable*/padding-bottom:0;
      }
    /*
    @tab Footer
    @section Footer Text
    */
      .footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{
        /*@editable*/color:#FFFFFF;
        /*@editable*/font-family:Helvetica;
        /*@editable*/font-size:12px;
        /*@editable*/line-height:150%;
        /*@editable*/text-align:center;
      }
    /*
    @tab Footer
    @section Footer Link
    */
      .footerContainer .mcnTextContent a,.footerContainer .mcnTextContent p a{
        /*@editable*/color:#FFFFFF;
        /*@editable*/font-weight:normal;
        /*@editable*/text-decoration:underline;
      }
    @media only screen and (min-width:768px){
      .templateContainer{
        width:600px !important;
      }
  
  }	@media only screen and (max-width: 480px){
      body,table,td,p,a,li,blockquote{
        -webkit-text-size-adjust:none !important;
      }
  
  }	@media only screen and (max-width: 480px){
      body{
        width:100% !important;
        min-width:100% !important;
      }
  
  }	@media only screen and (max-width: 480px){
      .mcnRetinaImage{
        max-width:100% !important;
      }
  
  }	@media only screen and (max-width: 480px){
      .mcnImage{
        width:100% !important;
      }
  
  }	@media only screen and (max-width: 480px){
      .mcnCartContainer,.mcnCaptionTopContent,.mcnRecContentContainer,.mcnCaptionBottomContent,.mcnTextContentContainer,.mcnBoxedTextContentContainer,.mcnImageGroupContentContainer,.mcnCaptionLeftTextContentContainer,.mcnCaptionRightTextContentContainer,.mcnCaptionLeftImageContentContainer,.mcnCaptionRightImageContentContainer,.mcnImageCardLeftTextContentContainer,.mcnImageCardRightTextContentContainer,.mcnImageCardLeftImageContentContainer,.mcnImageCardRightImageContentContainer{
        max-width:100% !important;
        width:100% !important;
      }
  
  }	@media only screen and (max-width: 480px){
      .mcnBoxedTextContentContainer{
        min-width:100% !important;
      }
  
  }	@media only screen and (max-width: 480px){
      .mcnImageGroupContent{
        padding:9px !important;
      }
  
  }	@media only screen and (max-width: 480px){
      .mcnCaptionLeftContentOuter .mcnTextContent,.mcnCaptionRightContentOuter .mcnTextContent{
        padding-top:9px !important;
      }
  
  }	@media only screen and (max-width: 480px){
      .mcnImageCardTopImageContent,.mcnCaptionBottomContent:last-child .mcnCaptionBottomImageContent,.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent{
        padding-top:18px !important;
      }
  
  }	@media only screen and (max-width: 480px){
      .mcnImageCardBottomImageContent{
        padding-bottom:9px !important;
      }
  
  }	@media only screen and (max-width: 480px){
      .mcnImageGroupBlockInner{
        padding-top:0 !important;
        padding-bottom:0 !important;
      }
  
  }	@media only screen and (max-width: 480px){
      .mcnImageGroupBlockOuter{
        padding-top:9px !important;
        padding-bottom:9px !important;
      }
  
  }	@media only screen and (max-width: 480px){
      .mcnTextContent,.mcnBoxedTextContentColumn{
        padding-right:18px !important;
        padding-left:18px !important;
      }
  
  }	@media only screen and (max-width: 480px){
      .mcnImageCardLeftImageContent,.mcnImageCardRightImageContent{
        padding-right:18px !important;
        padding-bottom:0 !important;
        padding-left:18px !important;
      }
  
  }	@media only screen and (max-width: 480px){
      .mcpreview-image-uploader{
        display:none !important;
        width:100% !important;
      }
  
  }	@media only screen and (max-width: 480px){
    /*
    @tab Mobile Styles
    @section Heading 1
    @tip Make the first-level headings larger in size for better readability on small screens.
    */
      h1{
        /*@editable*/font-size:30px !important;
        /*@editable*/line-height:125% !important;
      }
  
  }	@media only screen and (max-width: 480px){
    /*
    @tab Mobile Styles
    @section Heading 2
    @tip Make the second-level headings larger in size for better readability on small screens.
    */
      h2{
        /*@editable*/font-size:26px !important;
        /*@editable*/line-height:125% !important;
      }
  
  }	@media only screen and (max-width: 480px){
    /*
    @tab Mobile Styles
    @section Heading 3
    @tip Make the third-level headings larger in size for better readability on small screens.
    */
      h3{
        /*@editable*/font-size:20px !important;
        /*@editable*/line-height:150% !important;
      }
  
  }	@media only screen and (max-width: 480px){
    /*
    @tab Mobile Styles
    @section Heading 4
    @tip Make the fourth-level headings larger in size for better readability on small screens.
    */
      h4{
        /*@editable*/font-size:18px !important;
        /*@editable*/line-height:150% !important;
      }
  
  }	@media only screen and (max-width: 480px){
    /*
    @tab Mobile Styles
    @section Boxed Text
    @tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px.
    */
      .mcnBoxedTextContentContainer .mcnTextContent,.mcnBoxedTextContentContainer .mcnTextContent p{
        /*@editable*/font-size:14px !important;
        /*@editable*/line-height:150% !important;
      }
  
  }	@media only screen and (max-width: 480px){
    /*
    @tab Mobile Styles
    @section Header Text
    @tip Make the header text larger in size for better readability on small screens.
    */
      .headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{
        /*@editable*/font-size:16px !important;
        /*@editable*/line-height:150% !important;
      }
  
  }	@media only screen and (max-width: 480px){
    /*
    @tab Mobile Styles
    @section Body Text
    @tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px.
    */
      .bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{
        /*@editable*/font-size:16px !important;
        /*@editable*/line-height:150% !important;
      }
  
  }	@media only screen and (max-width: 480px){
    /*
    @tab Mobile Styles
    @section Footer Text
    @tip Make the footer content text larger in size for better readability on small screens.
    */
      .footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{
        /*@editable*/font-size:14px !important;
        /*@editable*/line-height:150% !important;
      }
  
  }</style>
  <script>!function(){function o(n,i){if(n&&i)for(var r in i)i.hasOwnProperty(r)&&(void 0===n[r]?n[r]=i[r]:n[r].constructor===Object&&i[r].constructor===Object?o(n[r],i[r]):n[r]=i[r])}try{var n=decodeURIComponent("%0A%7B%0A%22ResourceTiming%22%3A%7B%0A%22comment%22%3A%20%22Clear%20RT%20Buffer%20on%20mPulse%20beacon%22%2C%0A%22clearOnBeacon%22%3A%20true%0A%7D%2C%0A%22AutoXHR%22%3A%7B%0A%22comment%22%3A%20%22Monitor%20XHRs%20requested%20using%20FETCH%22%2C%0A%22monitorFetch%22%3A%20true%2C%0A%22comment%22%3A%20%22Start%20Monitoring%20SPAs%20from%20Click%22%2C%0A%22spaStartFromClick%22%3A%20true%0A%7D%2C%0A%22PageParams%22%3A%7B%0A%22comment%22%3A%20%22Monitor%20all%20SPA%20XHRs%22%2C%0A%22spaXhr%22%3A%20%22all%22%0A%7D%0A%7D");if(n.length>0&&window.JSON&&"function"==typeof window.JSON.parse){var i=JSON.parse(n);void 0!==window.BOOMR_config?o(window.BOOMR_config,i):window.BOOMR_config=i}}catch(r){window.console&&"function"==typeof window.console.error&&console.error("mPulse: Could not parse configuration",r)}}();</script>
                                <script>!function(a){var e="https://s.go-mpulse.net/boomerang/",t="addEventListener";if("True"=="True")a.BOOMR_config=a.BOOMR_config||{},a.BOOMR_config.PageParams=a.BOOMR_config.PageParams||{},a.BOOMR_config.PageParams.pci=!0,e="https://s2.go-mpulse.net/boomerang/";if(window.BOOMR_API_key="QAT5G-9HZLF-7EDMX-YMVCJ-QZJDA",function(){function n(e){a.BOOMR_onload=e&&e.timeStamp||(new Date).getTime()}if(!a.BOOMR||!a.BOOMR.version&&!a.BOOMR.snippetExecuted){a.BOOMR=a.BOOMR||{},a.BOOMR.snippetExecuted=!0;var i,_,o,r=document.createElement("iframe");if(a[t])a[t]("load",n,!1);else if(a.attachEvent)a.attachEvent("onload",n);r.src="javascript:void(0)",r.title="",r.role="presentation",(r.frameElement||r).style.cssText="width:0;height:0;border:0;display:none;",o=document.getElementsByTagName("script")[0],o.parentNode.insertBefore(r,o);try{_=r.contentWindow.document}catch(O){i=document.domain,r.src="javascript:var d=document.open();d.domain='"+i+"';void(0);",_=r.contentWindow.document}_.open()._l=function(){var a=this.createElement("script");if(i)this.domain=i;a.id="boomr-if-as",a.src=e+"QAT5G-9HZLF-7EDMX-YMVCJ-QZJDA",BOOMR_lstart=(new Date).getTime(),this.body.appendChild(a)},_.write("<bo"+'dy onload="document._l();">'),_.close()}}(),"400".length>0)if(a&&"performance"in a&&a.performance&&"function"==typeof a.performance.setResourceTimingBufferSize)a.performance.setResourceTimingBufferSize(400);!function(){if(BOOMR=a.BOOMR||{},BOOMR.plugins=BOOMR.plugins||{},!BOOMR.plugins.AK){var e=""=="true"?1:0,t="",n="yqzamqix35vo2zkix7cq-f-50b6840b5-clientnsv4-s.akamaihd.net",i="false"=="true"?2:1,_={"ak.v":"36","ak.cp":"314244","ak.ai":parseInt("199322",10),"ak.ol":"0","ak.cr":192,"ak.ipv":4,"ak.proto":"h2","ak.rid":"c96e7a4","ak.r":46154,"ak.a2":e,"ak.m":"x","ak.n":"essl","ak.bpcip":"196.50.6.0","ak.cport":52253,"ak.gh":"96.16.85.33","ak.quicv":"","ak.tlsv":"tls1.3","ak.0rtt":"","ak.csrc":"-","ak.acc":"","ak.t":"1699266501","ak.ak":"hOBiQwZUYzCg5VSAfCLimQ==5PAteGi5bZdnDNo/kmhZ34GCBhVBVPFNhqEucZKvDOMG8byxLIMF9lhVJ2e6ksfix/1gqISDulRXIRuCpo+cvn211D1qpGmVx1lV4uS/AfPM2FzaYEQex0OB0rrD7TVcH/Msb+3f+r1y7NNT1Z3SN6wRiO3t14PehskvJDR4eX5swx5ARlYb35yvvid0MBMfxkAR7Tol9fEMtgqmim+YTQHDY1adI/xZCJ94jUWWnTZ6qtA8y5qgUUKexEBBmS+WwNHkMDUoBRWxcIB8xLBxlDG9SpO5MKXpwoQERA2TDt+VmIQfbiVTbyE6RAxz8oRuzEM8wr3GAh7K1SB5TLSSRyByTBZFHOXAwDAkmBaq4mYiAGehLaDvsQJPEpTTCguA4N4/XrQ/FkPnucRvRsmgFNOp5w4hvPvswB4B+GkwVRY=","ak.pv":"160","ak.dpoabenc":"","ak.tf":i};if(""!==t)_["ak.ruds"]=t;var o={i:!1,av:function(e){var t="http.initiator";if(e&&(!e[t]||"spa_hard"===e[t]))_["ak.feo"]=void 0!==a.aFeoApplied?1:0,BOOMR.addVar(_)},rv:function(){var a=["ak.bpcip","ak.cport","ak.cr","ak.csrc","ak.gh","ak.ipv","ak.m","ak.n","ak.ol","ak.proto","ak.quicv","ak.tlsv","ak.0rtt","ak.r","ak.acc","ak.t","ak.tf"];BOOMR.removeVar(a)}};BOOMR.plugins.AK={akVars:_,akDNSPreFetchDomain:n,init:function(){if(!o.i){var a=BOOMR.subscribe;a("before_beacon",o.av,null,null),a("onbeacon",o.rv,null,null),o.i=!0}return this},is_complete:function(){return!0}}}}()}(window);</script></head>
      <body>
          <!--*|IF:|*-->
          <!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">*||*</span><!--<![endif]-->
          <!--*|END:IF|*-->
          <center>
              
                                      <!--[if (gte mso 9)|(IE)]>
                                      </td>
                                      </tr>
                                      </table>
                                      <![endif]-->
                                  </td>
                              </tr>
                              <tr>
                                  <td align="center" valign="top" id="templateBody" data-template-container>
                                      <!--[if (gte mso 9)|(IE)]>
                                      <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">
                                      <tr>
                                      <td align="center" valign="top" width="600" style="width:600px;">
                                      <![endif]-->
                                      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">
                                          <tr>
                                              <td valign="top" class="bodyContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
      <tbody class="mcnTextBlockOuter">
          <tr>
              <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                  <!--[if mso]>
          <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
          <tr>
          <![endif]-->
            
          <!--[if mso]>
          <td valign="top" width="300" style="width:300px;">
          <![endif]-->
                  <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:300px;" width="100%" class="mcnTextContentContainer">
                      <tbody><tr>
                          
                          <td valign="top" class="mcnTextContent" style="padding-top:0; padding-left:18px; padding-bottom:9px; padding-right:18px;">
                          
                            <h3><img data-file-id="7405724" height="120" src="" style="border: 0px; margin: 0px;"></h3>
  
                          </td>
                      </tr>
                  </tbody></table>
          <!--[if mso]>
          </td>
          <![endif]-->
                  
          <!--[if mso]>
          <td valign="top" width="300" style="width:300px;">
          <![endif]-->
                  <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:300px;" width="100%" class="mcnTextContentContainer">
                      <tbody><tr>
                          
                          <td valign="top" class="mcnTextContent" style="padding-top:0; padding-left:18px; padding-bottom:9px; padding-right:18px;">
                          
                              <div><br>
  &nbsp;</div>
  
  <div style="text-align: center;"><span style="font-size:35px"><strong style="color: #000;"></strong></span></div>
  
                          </td>
                      </tr>
                  </tbody></table>
          <!--[if mso]>
          </td>
          <![endif]-->
                  
          <!--[if mso]>
          </tr>
          </table>
          <![endif]-->
              </td>
          </tr>
      </tbody>
  </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">
      <tbody class="mcnDividerBlockOuter">
          <tr>
              <td class="mcnDividerBlockInner" style="min-width:100%; padding:18px;">
                  <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width: 100%;border-top: 2px dashed #505050;">
                      <tbody><tr>
                          <td>
                              <span></span>
                          </td>
                      </tr>
                  </tbody></table>
  <!--            
                  <td class="mcnDividerBlockInner" style="padding: 18px;">
                  <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />
  -->
              </td>
          </tr>
      </tbody>
  </table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">
      <tbody class="mcnTextBlockOuter">
          <tr>
              <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">
                  <!--[if mso]>
          <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">
          <tr>
          <![endif]-->
            
          <!--[if mso]>
          <td valign="top" width="600" style="width:600px;">
          <![endif]-->
                  <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">
                      <tbody><tr>
                          
                          <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">
                          
    
  ${body}
  
                          </td>
                      </tr>
                  </tbody></table>
          <!--[if mso]>
          </td>
          <![endif]-->
                  
          <!--[if mso]>
          </tr>
          </table>
          <![endif]-->
              </td>
          </tr>
      </tbody>
  </table></td>
                                          </tr>
                                      </table>
                                      <!--[if (gte mso 9)|(IE)]>
                                      </td>
                                      </tr>
                                      </table>
                                      <![endif]-->
                                  </td>
                              </tr>
              </table>
          </center>
      <script type="text/javascript"  src="/BO1_oK/GbJD/6N/7o_p/RpR_e__0SI4/3DuOJGDwfw/W3lIdCkmegE/aikxT09/RVQwB"></script></body>
  </html>
  
	`;
};
