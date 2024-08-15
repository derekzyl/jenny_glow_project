export function handleLineBreaks(body: string): string {
  // Combine newline and character break logic
  const regex = /(?<!\r)\n|.{1,40}(?!s)/g;

  // Replace with <br> tags while preserving whole words
  return body.replace(regex, '$&<br>');
}

export const defaultEmailTemplate = ({
  date,
  name,
  subject,
  body,
}: {
  body: string;
  subject: string;
  name: string;
  date: string;
}): string => {
  let bodyWithLineBreaks = body;

  bodyWithLineBreaks = handleLineBreaks(body);

  return `

</html>
<!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en"
  style="font-family:arial, 'helvetica neue', helvetica, sans-serif">

<head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="telephone=no" name="format-detection">
  <title>New email template 2023-12-26</title>

  <link href="https://fonts.googleapis.com/css2?family=Imprima&display=swap" rel="stylesheet">
  <style type="text/css">
    #outlook a {
      padding: 0;
    }

    .es-button {
      mso-style-priority: 100 !important;
      text-decoration: none !important;
    }

    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }

    .es-desk-hidden {
      display: none;
      float: left;
      overflow: hidden;
      width: 0;
      max-height: 0;
      line-height: 0;
      mso-hide: all;
    }

    @media only screen and (max-width:600px) {

      p,
      ul li,
      ol li,
      a {
        line-height: 150% !important
      }

      h1,
      h2,
      h3,
      h1 a,
      h2 a,
      h3 a {
        line-height: 120%
      }

      h1 {
        font-size: 30px !important;
        text-align: left
      }

      h2 {
        font-size: 24px !important;
        text-align: left
      }

      h3 {
        font-size: 20px !important;
        text-align: left
      }

      .es-header-body h1 a,
      .es-content-body h1 a,
      .es-footer-body h1 a {
        font-size: 30px !important;
        text-align: left
      }

      .es-header-body h2 a,
      .es-content-body h2 a,
      .es-footer-body h2 a {
        font-size: 24px !important;
        text-align: left
      }

      .es-header-body h3 a,
      .es-content-body h3 a,
      .es-footer-body h3 a {
        font-size: 20px !important;
        text-align: left
      }

      .es-menu td a {
        font-size: 14px !important
      }

      .es-header-body p,
      .es-header-body ul li,
      .es-header-body ol li,
      .es-header-body a {
        font-size: 14px !important
      }

      .es-content-body p,
      .es-content-body ul li,
      .es-content-body ol li,
      .es-content-body a {
        font-size: 14px !important
      }

      .es-footer-body p,
      .es-footer-body ul li,
      .es-footer-body ol li,
      .es-footer-body a {
        font-size: 14px !important
      }

      .es-infoblock p,
      .es-infoblock ul li,
      .es-infoblock ol li,
      .es-infoblock a {
        font-size: 12px !important
      }

      *[class="gmail-fix"] {
        display: none !important
      }

      .es-m-txt-c,
      .es-m-txt-c h1,
      .es-m-txt-c h2,
      .es-m-txt-c h3 {
        text-align: center !important
      }

      .es-m-txt-r,
      .es-m-txt-r h1,
      .es-m-txt-r h2,
      .es-m-txt-r h3 {
        text-align: right !important
      }

      .es-m-txt-l,
      .es-m-txt-l h1,
      .es-m-txt-l h2,
      .es-m-txt-l h3 {
        text-align: left !important
      }

      .es-m-txt-r img,
      .es-m-txt-c img,
      .es-m-txt-l img {
        display: inline !important
      }

      .es-button-border {
        display: block !important
      }

      a.es-button,
      button.es-button {
        font-size: 18px !important;
        display: block !important;
        border-right-width: 0px !important;
        border-left-width: 0px !important;
        border-top-width: 15px !important;
        border-bottom-width: 15px !important
      }

      .es-adaptive table,
      .es-left,
      .es-right {
        width: 100% !important
      }

      .es-content table,
      .es-header table,
      .es-footer table,
      .es-content,
      .es-footer,
      .es-header {
        width: 100% !important;
        max-width: 600px !important
      }

      .es-adapt-td {
        display: block !important;
        width: 100% !important
      }

      .adapt-img {
        width: 100% !important;
        height: auto !important
      }

      .es-m-p0 {
        padding: 0px !important
      }

      .es-m-p0r {
        padding-right: 0px !important
      }

      .es-m-p0l {
        padding-left: 0px !important
      }

      .es-m-p0t {
        padding-top: 0px !important
      }

      .es-m-p0b {
        padding-bottom: 0 !important
      }

      .es-m-p20b {
        padding-bottom: 20px !important
      }

      .es-mobile-hidden,
      .es-hidden {
        display: none !important
      }

      tr.es-desk-hidden,
      td.es-desk-hidden,
      table.es-desk-hidden {
        width: auto !important;
        overflow: visible !important;
        float: none !important;
        max-height: inherit !important;
        line-height: inherit !important
      }

      tr.es-desk-hidden {
        display: table-row !important
      }

      table.es-desk-hidden {
        display: table !important
      }

      td.es-desk-menu-hidden {
        display: table-cell !important
      }

      .es-menu td {
        width: 1% !important
      }

      table.es-table-not-adapt,
      .esd-block-html table {
        width: auto !important
      }

      table.es-social {
        display: inline-block !important
      }

      table.es-social td {
        display: inline-block !important
      }

      .es-desk-hidden {
        display: table-row !important;
        width: auto !important;
        overflow: visible !important;
        max-height: inherit !important
      }
    }

    @media screen and (max-width:384px) {
      .mail-message-content {
        width: 414px !important
      }
    }
  </style>
</head>

<body data-new-gr-c-s-loaded="14.1049.0"
  style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
  <div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:#FFFFFF">
    <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#ffffff"></v:fill> </v:background><![endif]-->
    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" role="none"
      style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FFFFFF">
      <tr>
        <td valign="top" style="padding:0;Margin:0">
          <table cellpadding="0" cellspacing="0" class="es-footer" align="center" role="none"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
            <tr>
              <td align="center" style="padding:0;Margin:0">
                <table bgcolor="#bcb8b1" class="es-footer-body" align="center" cellpadding="0" cellspacing="0"
                  role="none"
                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                  <tr>
                    <td align="left"
                      style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:40px;padding-right:40px">
                      <table cellpadding="0" cellspacing="0" width="100%" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:520px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr class="es-visible-simple-html-only">
                                <td align="center" style="padding:0;Margin:0;font-size:0px"><a target="_blank"
                                    href="https://viewstripo.email"
                                    style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#2D3142;font-size:14px"><img
                                      src="https://res.cloudinary.com/cybergenii/image/upload/v1703433248/paypaddy/c2uee0ewk0snwyvbmjuw.png"
                                      alt="Logo"
                                      style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;width:150px;height:150px"
                                      height="60" title="Logo" width="38"></a> </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
            <tr>
              <td align="center" style="padding:0;Margin:0">
                <table bgcolor="#efefef" class="es-content-body" align="center" cellpadding="0" cellspacing="0"
                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#EFEFEF;border-radius:20px 20px 0 0;width:600px"
                  role="none">
                  <tr>
                    <td align="left" style="padding:0;Margin:0;padding-top:40px;padding-left:40px;padding-right:40px">
                      <table cellpadding="0" cellspacing="0" width="100%" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:520px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="left" class="es-m-txt-c" style="padding:0;Margin:0;font-size:0px"><a
                                    target="_blank" href=""
                                    style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#2D3142;font-size:18px"><img
                                      src="https://fbymsmi.stripocdn.email/content/guids/CABINET_ee77850a5a9f3068d9355050e69c76d26d58c3ea2927fa145f0d7a894e624758/images/group_4076323.png"
                                      alt="Confirm email"
                                      style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border-radius:50px;width:50px;height:50px"
                                      width="100" title="Confirm email" height="100"></a> </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:40px;padding-right:40px">
                      <table cellpadding="0" cellspacing="0" width="100%" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:520px">
                            <table cellpadding="0" cellspacing="0" width="100%" bgcolor="#fafafa"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;background-color:#fafafa;border-radius:10px"
                              role="presentation">
                              <tr>
                                <td align="left" style="padding:20px;Margin:0">
                                  <h3
                                    style="Margin:0;line-height:34px;mso-line-height-rule:exactly;font-family:Imprima, Arial, sans-serif;font-size:28px;font-style:normal;font-weight:bold;color:#2D3142">
                                    ${subject}</h3>
                                     <h4
                                    style="Margin:0;line-height:34px;mso-line-height-rule:exactly;font-family:Imprima, Arial, sans-serif;font-size:28px;font-style:normal;font-weight:bold;color:#2D3142">
                                hi,    ${name}</h4>,
                                  <p
                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Imprima, Arial, sans-serif;line-height:27px;color:#2D3142;font-size:18px">
                                    <br></p>
                                  <p
                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Imprima, Arial, sans-serif;line-height:27px;color:#2D3142;font-size:18px">
                                    We are always honored you are part of the winning team..<br><br></p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
            <tr>
              <td align="center" style="padding:0;Margin:0">
                <table bgcolor="#efefef" class="es-content-body" align="center" cellpadding="0" cellspacing="0"
                  role="none"
                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#EFEFEF;width:600px">
                  <tr>
                    <td align="left"
                      style="Margin:0;padding-top:30px;padding-bottom:40px;padding-left:40px;padding-right:40px">
                      <table cellpadding="0" cellspacing="0" width="100%" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:520px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="center" style="padding:0;Margin:0"><span class="msohide es-button-border"
                                    style="border-style:solid;border-color:#2CB543; letter-spacing:2px;background:#fafafa;border-width:0px;display:block;width:auto;padding-bottom:12px;padding-top:12px;mso-hide:all"><div
                                     class="es-button msohide" target="_blank"
                                      style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#000000;font-size:14px;padding:15px 20px 15px 20px;display:block;background:#fafafa;border-radius:4px;font-weight:normal;font-style:normal;font-family:Imprima, Arial, sans-serif;width:auto;text-align:center;mso-padding-alt:0;mso-border-alt:4px solid #7630f3;mso-hide:all;padding-left:5px;padding-right:5px">${bodyWithLineBreaks}</div> </span> <!--<![endif]--></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="left" style="padding:0;Margin:0;padding-left:40px;padding-right:40px">
                      <table cellpadding="0" cellspacing="0" width="100%" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;width:520px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="left" style="padding:0;Margin:0">
                                  <p
                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Imprima, Arial, sans-serif;line-height:27px;color:#2D3142;font-size:18px">
                                    Thanks,<br><br>PayPaddy</p>
                                </td>
                              </tr>
                              <tr>
                                <td align="center"
                                  style="padding:0;Margin:0;padding-bottom:20px;padding-top:40px;font-size:0">
                                  <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0"
                                    role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                      <td
                                        style="padding:0;Margin:0;border-bottom:1px solid #666666;background:unset;height:1px;width:100%;margin:0px">
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
            <tr>
              <td align="center" style="padding:0;Margin:0">
                <table bgcolor="#efefef" class="es-content-body" align="center" cellpadding="0" cellspacing="0"
                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#EFEFEF;border-radius:0 0 20px 20px;width:600px"
                  role="none">
                  <tr>
                    <td class="esdev-adapt-off" align="left"
                      style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:40px;padding-right:40px">
                      <table cellpadding="0" cellspacing="0" class="esdev-mso-table" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:520px">
                        <tr>
                          <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                            <table cellpadding="0" cellspacing="0" align="left" class="es-left" role="none"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                              <tr>
                                <td align="center" valign="top" style="padding:0;Margin:0;width:47px">
                                  <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                      <td align="center" class="es-m-txt-l" style="padding:0;Margin:0;font-size:0px"><a
                                          target="_blank" href="mailto:contact@paypaddy.com"
                                          style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#2D3142;font-size:18px"><img
                                            src="https://fbymsmi.stripocdn.email/content/guids/CABINET_ee77850a5a9f3068d9355050e69c76d26d58c3ea2927fa145f0d7a894e624758/images/group_4076325.png"
                                            alt="Demo"
                                            style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"
                                            width="47" title="Demo" height="47"></a> </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td style="padding:0;Margin:0;width:20px"></td>
                          <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                            <table cellpadding="0" cellspacing="0" class="es-right" align="right" role="none"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                              <tr>
                                <td align="center" valign="top" style="padding:0;Margin:0;width:453px">
                                  <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                      <td align="left" style="padding:0;Margin:0">

                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table cellpadding="0" cellspacing="0" class="es-footer" align="center" role="none"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
            <tr>
              <td align="center" style="padding:0;Margin:0">
                <table bgcolor="#bcb8b1" class="es-footer-body" align="center" cellpadding="0" cellspacing="0"
                  role="none"
                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                  <tr>
                    <td align="left"
                      style="Margin:0;padding-left:20px;padding-right:20px;padding-bottom:30px;padding-top:40px">
                      <table cellpadding="0" cellspacing="0" width="100%" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="left" style="padding:0;Margin:0;width:560px">
                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation"
                              style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                              <tr>
                                <td align="center" class="es-m-txt-c"
                                  style="padding:0;Margin:0;padding-bottom:20px;font-size:0px"><img
                                    src="https://res.cloudinary.com/cybergenii/image/upload/v1703433248/paypaddy/c2uee0ewk0snwyvbmjuw.png"
                                    alt="Logo"
                                    style="display:block;border:0;width:100px;height:120px; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;font-size:12px"
                                    title="Logo" height="60" width="38"></td>
                              </tr>
                              <tr>
                                <td align="center" class="es-m-txt-c"
                                  style="padding:0;Margin:0;padding-top:10px;padding-bottom:20px;font-size:0">
                                  <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social"
                                    role="presentation"
                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                      <td align="center" valign="top" style="padding:0;Margin:0;padding-right:5px"><img
                                          src="https://fbymsmi.stripocdn.email/content/assets/img/social-icons/logo-black/twitter-logo-black.png"
                                          alt="Tw" title="Twitter" height="24" width="24"
                                          style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic">
                                      </td>
                                      <td align="center" valign="top" style="padding:0;Margin:0;padding-right:5px"><img
                                          src="https://fbymsmi.stripocdn.email/content/assets/img/social-icons/logo-black/facebook-logo-black.png"
                                          alt="Fb" title="Facebook" height="24" width="24"
                                          style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic">
                                      </td>
                                      <td align="center" valign="top" style="padding:0;Margin:0"><img
                                          src="https://fbymsmi.stripocdn.email/content/assets/img/social-icons/logo-black/linkedin-logo-black.png"
                                          alt="In" title="Linkedin" height="24" width="24"
                                          style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic">
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" style="padding:0;Margin:0">
                                  <p
                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Imprima, Arial, sans-serif;line-height:21px;color:#2D3142;font-size:13px">
                                    <a target="_blank"
                                      style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#2D3142;font-size:14px"
                                      href=""></a><a target="_blank"
                                      style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#2D3142;font-size:14px"
                                      href="">Privacy Policy</a>
                                    <a target="_blank"
                                      style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#2D3142;font-size:13px"
                                      href=""></a> • <a target="_blank"
                                      style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;color:#2D3142;font-size:14px"
                                      href="">Unsubscribe</a>
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td align="center" style="padding:0;Margin:0;padding-top:20px">
                                  <p
                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Imprima, Arial, sans-serif;line-height:21px;color:#2D3142;font-size:14px">
                                    <a target="_blank" href=""
                                      style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#2D3142;font-size:14px"></a>
                                    Copyright © ${date}&nbsp;PayPaddy<a target="_blank" href=""
                                      style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#2D3142;font-size:14px"></a>
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table cellpadding="0" cellspacing="0" class="es-footer" align="center" role="none"
            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
            <tr>
              <td align="center" style="padding:0;Margin:0">
                <table bgcolor="#ffffff" class="es-footer-body" align="center" cellpadding="0" cellspacing="0"
                  role="none"
                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                  <tr>
                    <td align="left" style="padding:20px;Margin:0">
                      <table cellpadding="0" cellspacing="0" width="100%" role="none"
                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                        <tr>
                          <td align="left" style="padding:0;Margin:0;width:560px">

                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>

</html>
`;
};