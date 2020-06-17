let editor;
let txt;
$(document).ready( () => {
    editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        lineNumbers: true,
        mode: 'c',
    });
    contentSemantic = CodeMirror.fromTextArea(document.getElementById('tokens'), {
      lineNumbers: true,
      readOnly: false
    });
    contentSemantic.setSize(null, 140);
    particlesJS("particle-container", {
        "particles": {
          "number": {
            "value": 80,
            "density": {
              "enable": true,
              "value_area": 800
            }
          },
          "color": {
            "value": "#ffffff"
          },
          "shape": {
            "type": "circle",
            "stroke": {
              "width": 0,
              "color": "#000000"
            },
            "polygon": {
              "nb_sides": 5
            },
            "image": {
              "src": "img/github.svg",
              "width": 100,
              "height": 100
            }
          },
          "opacity": {
            "value": 0.5,
            "random": false,
            "anim": {
              "enable": false,
              "speed": 1,
              "opacity_min": 0.1,
              "sync": false
            }
          },
          "size": {
            "value": 5,
            "random": true,
            "anim": {
              "enable": false,
              "speed": 40,
              "size_min": 0.1,
              "sync": false
            }
          },
          "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#ffffff",
            "opacity": 0.4,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 6,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "attract": {
              "enable": false,
              "rotateX": 600,
              "rotateY": 1200
            }
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": true,
              "mode": "repulse"
            },
            "onclick": {
              "enable": true,
              "mode": "push"
            },
            "resize": true
          },
          "modes": {
            "grab": {
              "distance": 400,
              "line_linked": {
                "opacity": 1
              }
            },
            "bubble": {
              "distance": 400,
              "size": 40,
              "duration": 2,
              "opacity": 8,
              "speed": 3
            },
            "repulse": {
              "distance": 200
            },
            "push": {
              "particles_nb": 4
            },
            "remove": {
              "particles_nb": 2
            }
          }
        },
        "retina_detect": true,
        "config_demo": {
          "hide_card": false,
          "background_color": "#b61924",
          "background_image": "",
          "background_position": "50% 50%",
          "background_repeat": "no-repeat",
          "background_size": "cover"
        }
      });
      editor.setValue(`void abc()\n\ta = ab + 1 + bb;\nvo2id int(int a)\n\ta = ab + 1 / 2 * 4;\nvoid abc(int a, int b, int a)\n\ta = b + c /* d;`);
      set()
})

function set(){
    let lexemas = setTokens(setLexemes(editor.getValue()));
    if(lexemas.length > 0){
      let rows = '';
      let rowse = ''
      let linea = 1;
      lexemas.forEach( item => {
          
          if(item.token.substring(0, 4) !== 'ERLX'){
            rows += `<tr><td>${item.lexeme}</td><td>${item.token}</td></tr>`;
          }else{
            rowse += `<tr><td>${item.lexeme}</td><td>${item.token}</td><td>${linea}</td><td>${item.err}</td></tr>`;
          }
          if(item.token == '\n'){
            linea++;
          }
          
      })
      $('#token').html(rows);
      $('#tokenerr').html(rowse);
    }else{
      toastr.warning('Aun no haz escrito nada...')
    }
    txt = ''
    lexemas.forEach( item => {
      if(item.token != '\n'){
        txt += item.token+' ';
      }else{
        txt += '\n';
      }
    })
    contentSemantic.setValue(txt);
}

function descargarArchivo(contenidoEnBlob, nombreArchivo) {
  var reader = new FileReader();
  reader.onload = function (event) {
      var save = document.createElement('a');
      save.href = event.target.result;
      save.target = '_blank';
      save.download = nombreArchivo || 'archivo.dat';
      var clicEvent = new MouseEvent('click', {
          'view': window,
              'bubbles': true,
              'cancelable': true
      });
      save.dispatchEvent(clicEvent);
      (window.URL || window.webkitURL).revokeObjectURL(save.href);
  };
  reader.readAsDataURL(contenidoEnBlob);
};


function generarTexto(datos) {
  datos = datos.split('\n');
  let texto = [];
  datos.forEach(item => {
    texto.push(item+'\n');
  })
  return new Blob(texto, {
      type: 'text/plain'
  });
};

function descargar(){
  descargarArchivo(generarTexto(txt), 'tokens.txt');
}