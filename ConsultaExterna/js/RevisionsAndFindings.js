(function ($) {

	$.fn.scse_revs_n_finds = function () {
		var component = $(this);
		var componentid = component.attr('id');
        var configuration = component.data("configuration");
        var bcItemId = component.data('bcitemid');

		if (configuration === null || configuration === undefined) {
			component.find("p").text("No existen datos para visualizar éste componente");
		} else {
			component.find("p").remove();

			// obtenemos la configuracion del json

			var $divrow = $('<div class ="row"></div>');
            var $legend = $('<div class="legendContainer"></div>');
            $legend.append('<a><img src="/images/Anormal.png">Anormal  </a>');
            $legend.append('<a><img src="/images/Normal.png">Normal  </a>');
            $legend.append('<a><img src="/images/NoEvaluado.png">No Evaluado  </a>');

			// agregar elementos principales
            $divrow.append($legend);
			$divrow.append(firstLoadTreeview(configuration, componentid));
			$divrow.append(firstLoadFindings(componentid));
			$divrow.append(firstLoadImageMap(configuration, componentid));
            $divrow.append(LoadButtonNormal(componentid));
            $divrow.append(firstLoadFindingResume(configuration, componentid));
			component.append($divrow);
            refreshFindingsResume(componentid);
			$('[data-toggle="tooltip"]').tooltip();
			$('#' + componentid + ' input[name=input-findings]').tagify({
				whitelist: [],
				dropdown: {
					classname: "tagify-" + componentid,
					enabled: 0
					//,maxItems: 5
				}
			}).on('add', function () {
				changeSelectedFindings(componentid);
				//$(this).data('tagify').dropdown.show.call($(this).data('tagify'), "");
			}).on("remove", function () {
				changeSelectedFindings(componentid);
			});
			/*
			$('#' + componentid + ' .tagify__dropdown__item--active').click(function () {
				console.log("click");
				$('#' + componentid + ' .tagify__input').focus();
			});
			*/
			/*
			$('#' + componentid + ' .tagify__input').focus(function () {
				//cuando llega aquí no se ha creado el item aún
				setTimeout(function () {
					console.log($('.tagify__dropdown__item'));
					$('.tagify__dropdown__item').click(function () {
						console.log("click en item");
						//$('#' + componentid + ' .tagify__input').focus();
					});
				}, 100);
			});
			*/
		}
	};

	function tagifyDataToStringArray(tagifyData) {
		var tfarr = [];
		jQuery.each(tagifyData, function (i, val) {
			tfarr.push(val.value);
		});
		return tfarr;
	}

	function onchecker(selectedsistemid, componentid) {
		var component = $('#' + componentid);
		var configuration = component.data("configuration");
		setGroupLogic(selectedsistemid, configuration);
        refreshTreeview(configuration, componentid);
        refreshFindingsResume(componentid);
	}
	function oncheckerchild(selectedsistemid, componentid) {
		var componentchild = $('#' + componentid);
		var configurationchild = componentchild.data("configuration");
		setchildLogic(selectedsistemid, configurationchild);
        refreshTreeview(configurationchild, componentid);
        refreshFindingsResume(componentid);
	}
    function firstLoadFindingResume(configuration, componentid) {

        var $resumeContentArea = $(`<div id="scse-resume-${componentid}" class="ExpandableTextArea col-md-2" data-expandedclass="col-md-6" data-defaultclass="col-2"></div>`);
        var $resume_content = $('<div class="form-group"></div>');
        var $resumeContainer = $(' <div class="containerTextarea"></div>');
        var $titleresume = $(' <div class="titleResume">Resumen hallazgos</div>');
        var $resumetextArea = $('<div class="areaResume"  readonly></div>');

        $resumeContainer.append($titleresume);
        $resumeContainer.append($resumetextArea);
        $resume_content.append($resumeContainer);
        $resumeContentArea.append($resume_content);

        return $resumeContentArea;
    }

	function firstLoadTreeview(configuration, componentid) {
        var $treeview = $(`<div id="scse-treeview-${componentid}" class="col-md-3 scse-treeview"></div>`);
		// creando el menú
		var $treeview_content = $('<div class="scse-treeview-content"></div>');

		$ul = $('<ul></ul>');

		var $treeview_header = $('<li class="header"></li>');
		$treeview_header.append($('<span class="f-left-treeview" >' + configuration.Description + '</span>'));
		$treeview_header.append($('<span class="f-right"><i class="fa fa-home"></i></span>'));
		$treeview_header.click(function () { selectRevision(0, componentid); });

		$ul.append($treeview_header);

		$.each(configuration.Revisions, function (index, rev) {
			$li = $('<li data-level="1" data-revid="' + rev.Id + '" data-componentid="' + componentid + '"></li>');
			// $anchor = $(`<a href="javascript:void(0);"><span class="f-left-treeview"> ${rev.Title} </span> <span class="f-right"><img src="/images/${rev.State}.png"></span></a>`);
			$anchor = $(`<a href="javascript:void(0);"></a>`);

			$spamtitle = $(`<span class="f-left-treeview"> ${rev.Title} </span>`);
			$spamchecker = $(`<span class="f-right"><img src="/images/${rev.State}.png"></span>`);
			$spamchecker.click(function () {
				onchecker(rev.Id, `${componentid}`);
			});
			$anchor.append($spamtitle);
			$anchor.append($spamchecker);
			$li.append($anchor);


			$anchor.click(function () { selectRevision(rev.Id, componentid); });

			/* Creando revisiones hijas */
			if (rev.Revisions !== null && rev.Revisions.length > 0) {
				$sub_ul = $('<ul></ul>');
				$.each(rev.Revisions, function (subindex, subrev) {
					$sub_li = $('<li data-level="2" data-revid="' + subrev.Id + '" data-componentid="' + componentid + '"></li>');
					//$sub_anchor = $(`<a href="javascript:void(0);"><span class="f-left-treeview"> ${subrev.Title} </span> <span class="f-right"><img src="/images/${subrev.State}.png"></span></a>`);

					$sub_anchor = $(`<a href="javascript:void(0);"></a>`);

					$sub_spamtitle = $(`<span class="f-left-treeview"> ${subrev.Title} </span>`);
					$sub_spamchecker = $(`<span class="f-right"><img src="/images/${subrev.State}.png"></span>`);
					$sub_spamchecker.click(function () {
						oncheckerchild(subrev.Id, `${componentid}`);
					});
					$sub_anchor.append($sub_spamtitle);
					$sub_anchor.append($sub_spamchecker);
					$sub_li.append($sub_anchor);
					$sub_anchor.click(function () { selectRevision(subrev.Id, componentid); });
					$sub_ul.append($sub_li);
				});
				$li.append($sub_ul);
			}

			$ul.append($li);
		});

		$treeview_content.append($ul);
		$treeview.append($treeview_content);
		return $treeview;
	}

	function firstLoadImageMap(configuration, componentid) {
		var $imagemap = $('<div class="col-md-5 animated fadeIn fast scse-imagemap"></div>');
		var $imagemapcontainer = $('<div class="scse-imagemap-container"></div>');
        var $image = $('<img class="img-fluid" src="' + configuration.Image + '"></img>');
        $imagemapcontainer.append($image);
       

		$.each(configuration.Revisions, function (index, rev) {
			var $divarea = $('<div class="scse-imagemap-area wave" data-toggle="tooltip" title="' + rev.Areaonparent.Title + '" data-rev-name="' + rev.Title + '" data-normal-x="' + rev.Areaonparent.Normalx + '" data-normal-y="' + rev.Areaonparent.Normaly + '" data-normal-w="' + rev.Areaonparent.Normalw + '" data-normal-h="' + rev.Areaonparent.Normalh + '" data-revid="' + rev.Id + '" data-componentid="' + componentid + '"></div>');
			$divarea.click(function () { selectRevision(rev.Id, componentid); });
			$imagemapcontainer.append($divarea);
		});

		$imagemap.append($imagemapcontainer);

		$image.on('load', function () {
			var component = $("#" + componentid);
			var container = component.find(".scse-imagemap-container");
			var actualImageWidth = $(this).prop("width");
			var actualImageHeight = $(this).prop("height");

			var areas = container.find(".scse-imagemap-area");

			areas.each(function () {
				$(this).css('left', actualImageWidth * $(this).data("normalX"));
				$(this).css('top', actualImageHeight * $(this).data("normalY"));
				$(this).css('width', actualImageWidth * $(this).data("normalW"));
				$(this).css('height', actualImageHeight * $(this).data("normalH"));
			});
		});

		return $imagemap;
	}

	function firstLoadFindings(componentid) {
		var $findings = $('<div class="scse-findings"></div>');

		/* radiobuttons */

		$divRadioBtnsCont = $('<div class="form-group row m-0"></div>');
		// Radio button Normal
		$divRadioBtnNormalCont = $('<div class="form-check form-check-inline m-4"></div>');
		$inputRadioNormal = $('<input class="form-check-input" type="radio" name="' + componentid + '_revisionstate" id="' + componentid + '_revisionstate1" value="Normal" data-revid="0" data-componentid="' + componentid + '">');
		$labelRadioNormal = $('<label class="form-check-label" for="' + componentid + '_revisionstate1">Normal</label>');
		$inputRadioNormal.click(function () {
			changeRevisionState($(this), componentid);
		});
		// Radio button Anormal
		$divRadioBtnAbnormalCont = $('<div class="form-check form-check-inline m-4"></div>');
		$inputRadioAbormal = $('<input class="form-check-input" type="radio" name="' + componentid + '_revisionstate" id="' + componentid + '_revisionstate2" value="Anormal" data-revid="0" data-componentid="' + componentid + '">');
		$labelRadioAbormal = $('<label class="form-check-label" for="' + componentid + '_revisionstate2">Anormal</label>');
		$inputRadioAbormal.click(function () {
			changeRevisionState($(this), componentid);
		});

		$divRadioBtnNormalCont.append($inputRadioNormal);
		$divRadioBtnNormalCont.append($labelRadioNormal);

		$divRadioBtnAbnormalCont.append($inputRadioAbormal);
		$divRadioBtnAbnormalCont.append($labelRadioAbormal);

		$divRadioBtnsCont.append($divRadioBtnNormalCont);
		$divRadioBtnsCont.append($divRadioBtnAbnormalCont);
		/* radiobuttons/ */

		/* input */
		$divSelectCont = $('<div  class="findings-group animated fadeIn fast mx-4 mb-4"></div>');
		$divSelectCont.append($('<label class="fullwidth col-form-label">Hallazgos</label>'));
		$inputFinds = $('<input type="text" name="input-findings" class="fullwidth" aria-describedby="addon-wrapping" placeholder="..." value="" autofocus>');
		/* /input */

		$divSelectCont.append($inputFinds);

		$findings.append($divRadioBtnsCont);
		$findings.append($divSelectCont);

        return $('<div id="findingColumn" class="col-md-3 hidden animated fadeIn fast"></div>').append($findings);
	}

	function getRevisionById(revisions, revid) {
		var revision = null;
		$.each(revisions, function (index, rev) {
			if (rev.Id === revid) {
				revision = rev;
				return;
			} else {
				$.each(rev.Revisions, function (subindex, subrev) {
					if (subrev.Id === revid) {
						revision = subrev;
						return;
					}
				});
			}
		});
		return revision;
	}

	function getRevisionAndParentIdById(revisions, revid) {
		var parentid = 0;
		var revision = null;
		$.each(revisions, function (index, rev) {
			if (rev.Id === revid) {
				revision = rev;
				return;
			} else {
				$.each(rev.Revisions, function (subindex, subrev) {
					if (subrev.Id === revid) {
						parentid = rev.Id;
						revision = subrev;
						return;
					}
				});
			}
		});
		var result = { "parentid": parentid, "revision": revision };

		return result;
	}

	function selectRevision(revid, componentid) {
		$('[data-toggle="tooltip"]').tooltip('dispose');
		var component = $("#" + componentid);

		// obtenemos la configuracion del json
		var configuration = component.data("configuration");

		component.find("li[data-level=1]").removeClass("selected");
		if (revid !== 0) {
			selectedli = component.find("li[data-revid=" + revid + "]");

			// actualizar el treeview seleccionado
			var parent = selectedli.parent();
			parent.find("li").removeClass("selected");
			selectedli.addClass("selected");

			if (selectedli.data("level") > 1) {
				selectedli.parent().parent().addClass("selected");
			}
		}

		updateImageMap(revid, componentid, component, configuration);
		$('[data-toggle="tooltip"]').tooltip();

		updateFindings(revid, componentid, component, configuration);

		// return false para evitar salto lal top de la página en los links href="#"
		return false;
	}

	function updateImageMap(revid, componentid, component, configuration) {
        var $imagemapcontainer = component.find(".scse-imagemap-container");
        $imagemapcontainer.find(".scse-imagemap-titulo").remove();
		$imagemapcontainer.find("img").remove();
		$imagemapcontainer.find(".scse-imagemap-area").remove();
		var $image = null;
		var $childrevisions = null;
		var $areagoback = null;
		var revtitle = '';
		var parentid = 0;


		if (revid === 0) {
			$image = $('<img class="img-fluid  animated fadeIn fast" src="' + configuration.Image + '"></img>');
			$childrevisions = jQuery.extend({}, configuration.Revisions);
            revtitle = configuration.Title;
            $imagemapcontainer.append($image);
		} else {
			var revisionresult = getRevisionAndParentIdById(configuration.Revisions, revid);
			var revision = revisionresult.revision;

			parentid = revisionresult.parentid;
			$image = $('<img class="img-fluid animated fadeIn fast" src="' + revision.Image + '"></img>');
			$childrevisions = jQuery.extend({}, revision.Revisions);
			revtitle = revision.Title;
            $areagoback = revision.Areagoback;
            $imagemapcontainer.append($image);
            $imagemapcontainer.append(`<div class="scse-imagemap-titulo">${revision.Title}</div>`);

		}

        
       
		if ($areagoback !== null) {
			var $divarea = $('<div class="scse-imagemap-area wave" data-toggle="tooltip" title="' + $areagoback.Title + '" data-rev-name="' + revtitle + '" data-normal-x="' + $areagoback.Normalx + '" data-normal-y="' + $areagoback.Normaly + '" data-normal-w="' + $areagoback.Normalw + '" data-normal-h="' + $areagoback.Normalh + '" data-revid="' + parentid + '" data-componentid="' + componentid + '"></div>');
			$divarea.click(function () {
				selectRevision(parentid, componentid);
			});
			$imagemapcontainer.append($divarea);
		}

		$.each($childrevisions, function (index, rev) {
			var $divarea = $('<div class="scse-imagemap-area wave" data-toggle="tooltip" title="' + rev.Areaonparent.Title + '" data-rev-name="' + rev.Title + '" data-normal-x="' + rev.Areaonparent.Normalx + '" data-normal-y="' + rev.Areaonparent.Normaly + '" data-normal-w="' + rev.Areaonparent.Normalw + '" data-normal-h="' + rev.Areaonparent.Normalh + '" data-revid="' + rev.Id + '" data-componentid="' + componentid + '"></div>');
			$divarea.click(function () {
				selectRevision(rev.Id, componentid);
			});
			$imagemapcontainer.append($divarea);
		});

		$image.on('load', function () {
			var container = component.find(".scse-imagemap-container");
			var actualImageWidth = $(this).prop("width");
			var actualImageHeight = $(this).prop("height");

			var areas = container.find(".scse-imagemap-area");

			areas.each(function () {
				$(this).css('left', actualImageWidth * $(this).data("normalX"));
				$(this).css('top', actualImageHeight * $(this).data("normalY"));
				$(this).css('width', actualImageWidth * $(this).data("normalW"));
				$(this).css('height', actualImageHeight * $(this).data("normalH"));
			});
		});
	}

	function updateBounds(component, hidden, componentid,type) {

        var img = component.find('.scse-imagemap');
		var objfindingColumn = component.find('#findingColumn');
		var treeview = $(`#scse-treeview-${componentid}`);

        switch (type) {
            case "inicio":
               treeview.removeClass('col-md-4');
                treeview.addClass('col-md-3');

               img.removeClass('col-md-4');
               img.removeClass('col-md-3');
               img.addClass('col-md-5');

                break;
            case "parentWithoutChilds":
                treeview.removeClass('col-md-4');
                treeview.addClass('col-md-3');

                img.removeClass('col-md-5');
                img.removeClass('col-md-3');
             
                img.addClass('col-md-4');
                break;
            case "parentWithChilds":
                treeview.removeClass('col-md-3');
                treeview.addClass('col-md-4');

                img.removeClass('col-md-5');
                img.removeClass('col-md-3');
                img.addClass('col-md-4');
                break;
            case "child":
                treeview.removeClass('col-md-3');
                treeview.addClass('col-md-4');

                img.removeClass('col-md-5');
                img.removeClass('col-md-4');
                img.addClass('col-md-3');
                break;
            case "random":
                if (treeview.hasClass('col-md-3') && img.hasClass('col-md-3')) {
                    updateBounds(component, hidden, componentid, "parentWithoutChilds");
                } else if (treeview.hasClass('col-md-3') && img.hasClass('col-md-4') && objfindingColumn.hasClass('hidden')) {
                    updateBounds(component, hidden, componentid, "inicio");

                }
                break;

        }
        refreshImageMapAreasOnResize();

		
	}

	function updateFindings(revid, componentid, component, configuration) {

		var $allnormalcontainer = component.find(".scse-buttonallnormal");
		var $parentallnormalcontainer = $allnormalcontainer.parent();


		var $findingscontainer = component.find(".scse-findings");
		var $parentFindingscontainer = $findingscontainer.parent();
		var revision = getRevisionById(configuration.Revisions, revid);

		if (revision === null) {// si revision es null es porque está en la raiz del componente no una revisión hija
			$parentFindingscontainer.addClass("hidden");
			$parentallnormalcontainer.removeClass("hidden");
			updateBounds(component, true, componentid,'inicio');
		} else {
			if (revision.Revisions !== null && revision.Revisions.length > 0) {
				$parentFindingscontainer.addClass("hidden");
				$parentallnormalcontainer.removeClass("hidden");
                updateBounds(component, true, componentid, 'parentWithChilds');
			} else {// solo en este caso se deben mostrar los hallazgos
                if (revision.Parent === "" || revision.Parent === -1 || revision.Parent === null) {
                    updateBounds(component, false, componentid, 'parentWithoutChilds');
                }
                else {
                    updateBounds(component, false, componentid,'child');
                }
                
				$parentFindingscontainer.removeClass("hidden");
				$parentallnormalcontainer.addClass("hidden");
				$findingscontainer.find('input:radio').prop('checked', false);
				$findingscontainer.find('input:radio').data('revid', revid);
				$("input[name='" + componentid + "_revisionstate'][value='" + revision.State + "']").prop('checked', true);
				loadFindings(revision, componentid);
			}
		}
	}

	function loadFindings(revision, componentid) {
		$inputFinds = $('#' + componentid + ' input[name=input-findings]');
		$inputFinds.data('tagify').removeAllTags();

		if (revision.State === 'Anormal') {
			showFindings(componentid);

			$inputFinds.data('tagify').settings.whitelist = revision.Availablefinds;
			//console.log($inputFinds.data('tagify').settings.whitelist);
			$inputFinds.data('tagify').addTags(revision.SelectedFinds);
		} else {
			hideFindings(componentid);
		}
	}

	function changeRevisionState(radioBtn, componentid) {
		var component = $('#' + componentid);
		var revid = radioBtn.data('revid');

		// actualizamos el estado de la revisión
		var configuration = component.data("configuration");
		var revision = getRevisionById(configuration.Revisions, revid);

		if (revision !== null) {
			revision.State = radioBtn.val();
			loadFindings(revision, componentid);

			if (revision.Parent !== -1 && revision.Parent !== "") {
				verifyChildState(configuration, revision);
			}

		}
        refreshTreeview(configuration, componentid);
        refreshFindingsResume(componentid);
	}

	function verifyChildState(configuration, revision) {
		var revisionParent = getRevisionById(configuration.Revisions, revision.Parent);
		// recorremos los hermanos 
		isAnormal = false;
		isNormal = false;
		NoEvaluado = false;

		revisionParent.Revisions.forEach(function (element) {
			switch (element.State) {
				case 'Anormal':
					isAnormal = true;
					break;
				case 'Normal':
					isNormal = true;
					break;
				case 'NoEvaluado':
					NoEvaluado = true;
					break;
			}
			//if (element.State === "Anormal") {
			//    isAnormal = true;
			//}
		});
		if (isAnormal) {
			revisionParent.State = "Anormal";
		} else if (isNormal) {
			revisionParent.State = "Normal";
		} else {
			revisionParent.State = "NoEvaluado";
		}
	}

	function hideFindings(componentid) {
		$('#' + componentid + ' .findings-group').addClass("hidden");
	}

	function showFindings(componentid) {
		$('#' + componentid + ' .findings-group').removeClass("hidden");
	}

    function changeSelectedFindings(componentid) {
        var component = $('#' + componentid);
        var $findingscontainer = component.find(".scse-findings");
        var revid = $findingscontainer.find('input:radio').data('revid');

        // actualizamos los elementos seleccionados
        var configuration = component.data("configuration");
        var revision = getRevisionById(configuration.Revisions, revid);
        if (revision !== null) {
            var dataTagify = $('#' + componentid + ' input[name=input-findings]').data('tagify');
            revision.SelectedFinds = tagifyDataToStringArray(dataTagify.value);
            refreshFindingsResume(componentid);
        }
    }

    function refreshFindingsResume(componentid) {
        var isOk = true;
        var component = $('#' + componentid);
        var configuration = component.data("configuration");
        // busco padres sin hijos Anormales y con hallazgos  o padres anormales sin hallazgos pero con hijos anormales
       // var findingsSelected = configuration.Revisions.filter(x => x.SelectedFinds.length != 0 && x.State === 'Anormal' || x.State === 'Anormal' && x.Revisions != null)
		var findingsSelected = configuration.Revisions.filter(x => x.State === 'Anormal' || x.State === 'Anormal' && x.Revisions !== null);

      
        var $findingsResumecontainer = component.find(`#scse-resume-${componentid}`);
        var isRequired = component.data('required') !== undefined ? component.data('required').toLowerCase() === 'true' ? true : false : false;
        var texto = "";
        if (findingsSelected.length <= 0) {
			texto = "No hay hallazgos reportados";
        }
        $.each(findingsSelected, function (index, item) {

            // primero busco si tiene hijos
            if (item.Revisions !== null) {
				texto = `${texto}<b>${item.Title}</b>: <br/>`;
                var hijosAnormales = item.Revisions.filter(x => x.State === 'Anormal');
                $.each(hijosAnormales, function (index, hijo) {
                    if (hijo.SelectedFinds.length === 0)
                        isOk = false;
					texto = `${texto}<b>${hijo.Title}</b>: ${hijo.SelectedFinds.length > 0 ? hijo.SelectedFinds.join(', ') : '<font color = "#F47E49">Anormal sin hallazgos reportados</font>'} <br/>`;
                });

            }
            else {
                if (item.SelectedFinds.length === 0)
                    isOk = false;                   

				texto = `${texto}<b>${item.Title}</b>: ${item.SelectedFinds.length > 0 ? item.SelectedFinds.join(', ') : '<font color = "#F47E49">Anormal sin hallazgos reportados</font>'} <br/>`;
            }
        });

        if (isRequired) {
            if (isOk)
                $("#" + component.data('bcitemid')).removeClass('bcError');
            else
                $("#" + component.data('bcitemid')).addClass('bcError');
        }
        $findingsResumecontainer.find(".areaResume")[0].innerHTML = texto;
    }


	function refreshImageMapAreasOnResize() {
		var $imagemapcontainers = $(".scse-imagemap-container");

		$.each($imagemapcontainers, function (index, container) {
			var $image = $(container).find("img");

			var actualImageWidth = $image.prop("width");
			var actualImageHeight = $image.prop("height");

			var areas = $(container).find(".scse-imagemap-area");

			areas.each(function () {
				$(this).css('left', actualImageWidth * $(this).data("normalX"));
				$(this).css('top', actualImageHeight * $(this).data("normalY"));
				$(this).css('width', actualImageWidth * $(this).data("normalW"));
				$(this).css('height', actualImageHeight * $(this).data("normalH"));
			});
		});
	}

	function LoadButtonNormal(componentid) {
		var $findings = $('<div class="scse-buttonallnormal"></div>');
		$divRadioBtnsCont = $('<div class="form-group"></div>');
		$divRadioBtnTodoNormalCont = $('<div class="form-check form-check-inline"></div>');
		$inputRadioTodoNormal = $(`<input class="buttonallnormal" type="button" name="${componentid}_revisionallstate" id="${componentid}_revisionallstate1" value="Todo normal" data-revid="0" data-componentid="${componentid}"  >`);
		$inputRadioTodoNormal.click(function () {
			setAllNormal(componentid);
		});
		$divRadioBtnTodoNormalCont.append($inputRadioTodoNormal);
		$divRadioBtnsCont.append($divRadioBtnTodoNormalCont);
		$findings.append($divRadioBtnsCont);
		return $('<div class="col-md-2 animated fadeIn fast"></div>').append($findings);

	}

	function setAllNormal(componentid) {

		var component = $('#' + componentid);
		var configuration = component.data("configuration");

		// valida si existe un nodo seleccionado
		if ($(`#scse-treeview-${componentid} .selected`).length > 0) {
			var selectedsistemid = $(`#scse-treeview-${componentid} .selected`)[0].getAttribute("data-revid");
			setGroupNormal(selectedsistemid, configuration);
		}
		else {
			$.each(configuration.Revisions, function (index, rev) {
				rev.State = 'Normal';

				if (rev.Revisions !== null && rev.Revisions.length > 0) {
					$.each(rev.Revisions, function (subindex, subrev) {
						subrev.State = 'Normal';
					});
				}

			});
		}
		refreshTreeview(configuration, componentid);
        refreshFindingsResume(componentid);
	}



	function setGroupNormal(selectedsistemid, configuration) {

		var item = configuration.Revisions.find(x => x.Id === selectedsistemid);
		item.State = 'Normal';
		if (item.Revisions !== null && item.Revisions.length > 0) {
			$.each(item.Revisions, function (subindex, subrev) {
				subrev.State = 'Normal';
			});
		}

	}

	function setGroupLogic(selectedsistemid, configuration) {
		var item = configuration.Revisions.find(x => x.Id === selectedsistemid);
		var nuevoEstado;
		switch (item.State) {
			case 'NoEvaluado':
				nuevoEstado = 'Normal';
				break;
			case 'Normal':
				nuevoEstado = 'NoEvaluado';
				break;
			case 'Anormal':
				break;
		}
		if (item.State !== 'Anormal') {
			item.State = nuevoEstado;
			if (item.Revisions !== null && item.Revisions.length > 0) {
				$.each(item.Revisions, function (subindex, subrev) {
					subrev.State = nuevoEstado;
				});
			}
		}

	}

	function setchildLogic(selectedsistemid, configurationchild) {

		$.each(configurationchild.Revisions, function (index, rev) {

			if (rev.Revisions !== null && rev.Revisions.length > 0) {
				if (rev.Revisions.find(x => x.Id === selectedsistemid) !== undefined) {
					subrev = rev.Revisions.find(x => x.Id === selectedsistemid);
					if (subrev.State === 'NoEvaluado') {
						subrev.State = 'Normal';

					} else if (subrev.State === 'Normal') {
						subrev.State = 'NoEvaluado';
					}

					verifyChildState(configurationchild, subrev);
				}
			}



		});

	}



    function refreshTreeview(configuration, componentid) {
        $(`#scse-treeview-${componentid}`).replaceWith(firstLoadTreeview(configuration, componentid));
        updateBounds($(`#${componentid}`), true, componentid, 'random');
        
	}

	$(window).resize(function () {
		refreshImageMapAreasOnResize();
	});

}(jQuery));


//Validación
(function ($) {
    $.fn.ValidateComponent = function () {
        //var component = $('#' + componentid);
        var component = this;
        var isRequired = component.data('required') !== undefined ? component.data('required').toLowerCase() === 'true' ? true : false : false;
        if (!isRequired)
            return true;
        var configuration = component.data("configuration");
        
        // busco padres sin hijos Anormales y con hallazgos  o padres anormales sin hallazgos pero con hijos anormales
        // var findingsSelected = configuration.Revisions.filter(x => x.SelectedFinds.length != 0 && x.State === 'Anormal' || x.State === 'Anormal' && x.Revisions != null)
        var isValid = true;

        var findingsUnselected = configuration.Revisions.filter(x => x.State === 'NoEvaluado').length;
        if (findingsUnselected === configuration.Revisions.length) {
            isValid = false;
        }

        var findingsSelected = configuration.Revisions.filter(x => x.State === 'Anormal' || x.State === 'Anormal' && x.Revisions !== null);
                       
        var texto = "";
        if (findingsSelected.length <= 0) {
            texto = "No hay hallazgos reportados";
        }
        $.each(findingsSelected, function (index, item) {

            // primero busco si tiene hijos
            if (item.Revisions !== null) {
                //texto = `${texto}<b>${item.Title}</b>: <br/>`;
                var hijosAnormales = item.Revisions.filter(x => x.State === 'Anormal');
                $.each(hijosAnormales, function (index, hijo) {
                    if (hijo.SelectedFinds.length === 0)
                        isValid = false;
                });

            }
            else {
                if (item.SelectedFinds.length === 0) 
                    isValid = false;
            }
        });

        if (!isValid)
            $("#" + component.data('bcitemid')).addClass('bcError');
        else
            $("#" + component.data('bcitemid')).removeClass('bcError');

        return isValid;
    };
}(jQuery));

/* GUARDADO PARCIAL */

(function ($) {
    $.fn.ComponentPartialSave = async function () {
        var $component = this;
        var episode = $component.data('episode');
        var firstsave = $component.data('firstSave');
        var jsonApiUrl = $component.data('apiBaseUrl');
        var jsonApiCollection = $component.data('apiCollectionName');
        var configuration = $component.data('configuration');
        var lastsaved = JSON.stringify($component.data("lastsaved"));


        var $jsonObj = createPartialSaveObject(episode, jsonApiCollection, GetUserData(configuration));
        if ($jsonObj === null) {
            console.log('json bad format');
            return;
        }

        if (JSON.stringify($jsonObj) !== lastsaved) {
            var method = 'POST';
            if (!firstsave) {
                method = 'PUT';
            }

            var result = await SendPartialSavedData2($jsonObj, method, 'text');
            if (result) {
                $component.data("lastsaved", $jsonObj);
                $component.data('firstSave', false);
            }

            console.log('revisions result: ' + result);
            return result;
        }
    

        function GetUserData(configuration) {
            var jsonUserData = {
                JsonRevisions: [
                ]
            };

            var result = GetRecursiveRevisionsData(configuration.Revisions);
            if (result !== null) {
                jsonUserData.JsonRevisions = result;
            }

            return jsonUserData;
        }

        function GetRecursiveRevisionsData(Revisions) {
            var JsonRevisions = null;

            if (Revisions !== null) {
                JsonRevisions = [];
                $.each(Revisions, function (index, rev) {
                    if (rev.State !== 'NoEvaluado') {
                        var JsonRevision = { Id: rev.Id, State: rev.State, SelectedFinds: rev.SelectedFinds, Revisions: GetRecursiveRevisionsData(rev.Revisions) };
                        JsonRevisions.push(JsonRevision);
                    }
                });
            }
            return JsonRevisions;
        }

    };
}(jQuery));

(function ($) {
	$.fn.startRevisionsAndFindingsPartialSaveInterval = function () {
		return this.each(function () {
			var $component = $(this);
            setInterval(function () { $component.ComponentPartialSave();/*ComponentPartialSave($component)*/; }, $component.data('saveIntervalMinutes') * 60000);
		});
	};
}(jQuery));

/* /GUARDADO PARCIAL */