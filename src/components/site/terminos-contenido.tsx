import type { ReactNode } from "react";

// Texto único de los Términos y Condiciones. Se reutiliza en la página
// /terminos y en el diálogo de aceptación previo al login (ver TerminosDialog).
// Si cambias el texto, actualiza también TERMINOS_ACTUALIZADO.
export const TERMINOS_ACTUALIZADO = "28 de agosto de 2026";

function H({ children }: { children: ReactNode }) {
  return <h2 className="mt-8 font-serif text-xl font-semibold text-foreground">{children}</h2>;
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{children}</p>;
}

function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
      {children}
    </ul>
  );
}

export function TerminosContenido() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-foreground">
        Términos y Condiciones de Uso
      </h1>
      <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Última actualización: {TERMINOS_ACTUALIZADO}
      </p>

      <H>1. Objeto</H>
      <P>
        Los presentes Términos y Condiciones regulan el acceso, registro y utilización de{" "}
        <strong>Salvar Valle del Tiétar</strong> (en adelante, «la Plataforma»), una iniciativa
        destinada a facilitar la visibilidad y promoción de negocios, actividades, servicios e
        iniciativas del Valle del Tiétar.
      </P>
      <P>
        El registro y utilización de las funcionalidades sujetas a cuenta implica la aceptación de
        estos Términos y Condiciones.
      </P>

      <H>2. Finalidad de la Plataforma</H>
      <P>
        Salvar Valle del Tiétar permite a usuarios particulares y negocios registrarse y utilizar
        las funcionalidades disponibles en cada momento. Entre otras funciones, la Plataforma puede
        permitir consultar negocios y establecimientos, descubrir actividades y servicios, crear y
        gestionar perfiles de negocio y publicar contenidos relacionados con los establecimientos y
        con el Valle del Tiétar.
      </P>
      <P>
        La Plataforma es actualmente gratuita tanto para usuarios particulares como para negocios.
        No se realizan compras ni pagos a través de la Plataforma.
      </P>

      <H>3. Naturaleza del servicio</H>
      <P>
        La Plataforma actúa como medio de información, difusión y conexión entre usuarios y
        negocios. No es propietaria ni gestiona los establecimientos publicados y no interviene en
        la contratación o prestación de los productos y servicios ofrecidos por dichos negocios.
      </P>
      <P>
        Cada establecimiento es responsable de su actividad, servicios, precios, horarios,
        promociones, disponibilidad y de la información que facilite. La Plataforma no garantiza la
        calidad, disponibilidad o adecuación de los productos o servicios ofrecidos por terceros.
      </P>

      <H>4. Registro y cuentas</H>
      <P>
        Pueden registrarse tanto usuarios particulares como negocios. El usuario se compromete a
        proporcionar información veraz y actualizada, no suplantar a otras personas o
        establecimientos y mantener la confidencialidad de sus credenciales de acceso.
      </P>
      <P>
        Quien cree o administre el perfil de un negocio declara disponer de autorización suficiente
        para representar o gestionar la presencia de dicho negocio en la Plataforma.
      </P>
      <P>
        La Plataforma no establece actualmente una edad mínima específica de registro, sin
        perjuicio de las limitaciones y requisitos que establezca en cada momento la legislación
        aplicable, especialmente en materia de protección de datos de menores.
      </P>

      <H>5. Contenido aportado por los negocios</H>
      <P>
        Los negocios pueden subir a la Plataforma fotografías, vídeos y audios relacionados con su
        establecimiento, actividad, servicios o historia, así como la información necesaria para
        completar su perfil.
      </P>
      <P>
        Quien suba contenido declara que es titular del mismo o dispone de los derechos y
        autorizaciones necesarios para utilizarlo y autorizar su uso conforme a estos Términos.
        También declara que el contenido no vulnera derechos de propiedad intelectual, derechos de
        imagen, privacidad u otros derechos de terceros.
      </P>
      <P>
        Cuando aparezcan o puedan identificarse terceras personas en fotografías, vídeos o audios,
        el negocio será responsable de disponer de las autorizaciones que resulten necesarias para
        permitir los usos previstos en estos Términos.
      </P>
      <P>El negocio conserva los derechos que legalmente le correspondan sobre el contenido que aporta.</P>

      <H>6. Autorización para utilizar, editar y publicar el contenido</H>
      <P>
        Al subir fotografías, vídeos, audios u otros contenidos a Salvar Valle del Tiétar, el
        negocio concede a la Plataforma una autorización no exclusiva y gratuita para utilizar
        dichos contenidos con fines relacionados con la difusión y promoción del negocio, de la
        Plataforma y de las iniciativas vinculadas al Valle del Tiétar.
      </P>
      <P>Esta autorización permite a Salvar Valle del Tiétar:</P>
      <UL>
        <li>Publicar y mostrar el contenido en la propia Plataforma.</li>
        <li>Publicar y difundir el contenido en las cuentas oficiales del proyecto en Instagram.</li>
        <li>
          Reutilizar el contenido en diferentes secciones de la Plataforma o publicaciones de
          Instagram relacionadas con el proyecto.
        </li>
        <li>Recortar, redimensionar, comprimir o adaptar fotografías y vídeos a los formatos necesarios.</li>
        <li>Editar vídeos y crear versiones más cortas, reels u otras piezas audiovisuales.</li>
        <li>
          Incorporar textos, subtítulos, rótulos, elementos gráficos, música cuando se disponga de
          los derechos necesarios y elementos identificativos de Salvar Valle del Tiétar.
        </li>
        <li>
          Adaptar audios y vídeos para mejorar su presentación o adecuarlos al formato de
          publicación.
        </li>
      </UL>
      <P>
        La aceptación de estos Términos y la subida voluntaria del contenido constituye la
        autorización para estos usos, por lo que no será necesario solicitar una autorización
        individual para cada publicación en la Plataforma o en la cuenta oficial de Instagram del
        proyecto.
      </P>
      <P>La Plataforma no adquiere la propiedad del contenido por el hecho de recibir esta autorización.</P>

      <H>7. Contenido prohibido y responsabilidad</H>
      <P>
        No se podrá publicar contenido ilegal, fraudulento, engañoso, amenazante, discriminatorio,
        difamatorio, que vulnere derechos de terceros, que contenga malware o enlaces fraudulentos,
        que suplante a otra persona o negocio o que se utilice para realizar spam o actividades
        contrarias a la legislación aplicable.
      </P>
      <P>
        El usuario o negocio que aporte contenido será responsable de disponer de los derechos y
        permisos necesarios para su publicación y utilización conforme a estos Términos.
      </P>

      <H>8. Moderación, retirada de contenido y suspensión de cuentas</H>
      <P>
        Salvar Valle del Tiétar podrá revisar los perfiles y contenidos publicados para mantener el
        correcto funcionamiento de la Plataforma y comprobar el cumplimiento de estos Términos y de
        la normativa aplicable.
      </P>
      <P>
        Cuando exista un incumplimiento, la Plataforma podrá solicitar la corrección de
        información, ocultar o retirar contenido, suspender temporalmente una cuenta o eliminarla en
        los casos que lo justifiquen.
      </P>
      <P>
        También podrán adoptarse estas medidas ante suplantaciones de identidad, utilización
        fraudulenta, publicación de contenido ilegal, vulneración de derechos de terceros, ataques
        contra la seguridad de la Plataforma o utilización abusiva del servicio.
      </P>

      <H>9. Información proporcionada por los negocios</H>
      <P>
        La información de los establecimientos puede ser proporcionada directamente por los propios
        negocios. Aunque se procurará mantenerla actualizada, Salvar Valle del Tiétar no puede
        garantizar que todos los datos sean permanentemente exactos.
      </P>
      <P>
        Los usuarios deberán confirmar directamente con el establecimiento aquellos datos que
        puedan cambiar, como horarios, precios, promociones, disponibilidad o servicios ofrecidos.
      </P>

      <H>10. Enlaces y servicios externos</H>
      <P>
        La Plataforma podrá contener enlaces a páginas web, redes sociales, mapas y otros servicios
        gestionados por terceros. Salvar Valle del Tiétar no controla necesariamente dichos
        servicios y su utilización estará sujeta a las condiciones establecidas por sus respectivos
        responsables.
      </P>

      <H>11. Propiedad intelectual de la Plataforma</H>
      <P>
        El software, diseño, estructura, marca, logotipos, elementos gráficos y contenidos propios
        de Salvar Valle del Tiétar están protegidos por la legislación aplicable en materia de
        propiedad intelectual e industrial.
      </P>
      <P>
        Esta disposición no modifica la titularidad que corresponda a usuarios, negocios o terceros
        sobre los contenidos que hayan aportado a la Plataforma.
      </P>

      <H>12. Disponibilidad y modificaciones del servicio</H>
      <P>
        Se procurará mantener la Plataforma disponible y operativa, pero no se garantiza un
        funcionamiento ininterrumpido. El servicio puede verse temporalmente afectado por
        mantenimiento, actualizaciones, fallos técnicos, incidencias de proveedores externos,
        problemas de seguridad o causas de fuerza mayor.
      </P>
      <P>
        La Plataforma podrá incorporar, modificar o retirar funcionalidades cuando sea necesario
        para desarrollar, mantener, mejorar o proteger el servicio.
      </P>

      <H>13. Protección de datos y cookies</H>
      <P>
        El tratamiento de datos personales realizado a través de la Plataforma se regirá por la
        Política de Privacidad de Salvar Valle del Tiétar y por la normativa aplicable.
      </P>
      <P>
        La utilización de cookies y tecnologías similares se regulará, cuando corresponda, mediante
        la Política de Cookies de la Plataforma.
      </P>

      <H>14. Comunicaciones relacionadas con la cuenta</H>
      <P>
        La Plataforma podrá enviar comunicaciones necesarias para el funcionamiento del servicio,
        como mensajes de registro, verificación de cuenta, recuperación de contraseña, seguridad,
        gestión del perfil o cambios relevantes en el servicio.
      </P>
      <P>
        Las comunicaciones comerciales o promocionales que legalmente requieran consentimiento se
        gestionarán de forma diferenciada.
      </P>

      <H>15. Baja de la cuenta</H>
      <P>
        Los usuarios y negocios podrán solicitar la eliminación de su cuenta mediante los
        mecanismos que la Plataforma habilite para ello.
      </P>
      <P>
        La eliminación de la cuenta no afectará a aquellas obligaciones de conservación que
        resulten exigibles legalmente ni a los usos del contenido realizados legítimamente con
        anterioridad a la solicitud de eliminación.
      </P>

      <H>16. Modificación de los Términos y Condiciones</H>
      <P>
        Estos Términos podrán modificarse para adaptarlos a cambios legislativos, nuevas
        funcionalidades o cambios relevantes en el funcionamiento de Salvar Valle del Tiétar. La
        versión vigente estará disponible en la Plataforma e indicará su fecha de última
        actualización.
      </P>
      <P>
        Cuando los cambios sean sustanciales, se procurará informar a los usuarios registrados por
        medios razonables.
      </P>

      <H>17. Legislación aplicable</H>
      <P>
        Estos Términos y Condiciones se regirán por la legislación española y por la normativa de
        la Unión Europea que resulte aplicable.
      </P>
      <P>
        Cualquier controversia se resolverá ante los juzgados y tribunales que resulten competentes
        conforme a la legislación aplicable, respetando en todo caso los derechos que correspondan a
        consumidores y usuarios.
      </P>

      <P>
        Al registrarse y utilizar Salvar Valle del Tiétar, el usuario declara haber tenido acceso a
        estos Términos y Condiciones y se compromete a respetarlos.
      </P>
    </div>
  );
}
